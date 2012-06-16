<?php

/**
 * @author gonzalo@in-prove.com
 * @copyright InProve
 *
 */

class InProve_Git {

    /**
     * Issue a GIT command and return output...
     *
     * @param string $command
     * @param string $repopath
     * @param string $worktree
     * @return struct
	 */
    public function issuecommand($command, $repopath, $worktree) {

        #
        $INPROVE_BE_HOME = InProve_System::get_eva("INPROVE_BE_HOME");

        # Set git environment variables...
        if (file_exists($repopath) && ($worktree===null || $worktree==="null" || file_exists($worktree))) {
            #
            putenv("GIT_DIR=$repopath");
            if ($worktree!==null) { putenv("GIT_WORK_TREE=$worktree"); }
            putenv("TEMP=".InProve_System::get_prm("basedir_temp"));
            putenv("TMP=".InProve_System::get_prm("basedir_temp"));
            #
            putenv("GIT_AUTHOR_NAME=Unknown");
            putenv("GIT_AUTHOR_EMAIL=Unknown");
            putenv("GIT_COMMITTER_NAME=".InProve_Session::getSessVar("MyProfile.userdata.username"));
            putenv("GIT_COMMITTER_EMAIL=".InProve_Session::getSessVar("MyProfile.userdata.email"));
            #
            list($cmdsts, $cmdout) = InProve_System::shell_exec("\"$INPROVE_BE_HOME/Git/bin/git.exe\" $command");

        } else {
            #
            if (!file_exists($repopath)) {
                $cmdout = "Repository not found [$repopath].";
            } else {
                $cmdout = "Worktree not found [$worktree].";
            }
            $cmdsts = -1;
        }

        $env = array(
                    "INPROVE_BE_HOME"=>$INPROVE_BE_HOME,
                    "TEMP"=>getenv("TEMP"),
                    "TMP"=>getenv("TMP"),
                    "GIT_AUTHOR_NAME"=>getenv("GIT_AUTHOR_NAME"),
                    "GIT_AUTHOR_EMAIL"=>getenv("GIT_AUTHOR_EMAIL"),
                    "GIT_COMMITTER_NAME"=>getenv("GIT_COMMITTER_NAME"),
                    "GIT_COMMITTER_EMAIL"=>getenv("GIT_COMMITTER_EMAIL"),
                    "command"=>$command,
                    "repopath"=>$repopath,
                    "worktree"=>$worktree
                    );

    return array("env"=>$env, "sts"=>$cmdsts, "out"=>$cmdout);
    }

	/**
	 * Get repository status/info...
     *
     * @param string $repopath
     * @param string $worktree
     * @param integer $commits_per_branch
     * @param integer $objects_per_commit
     * @return struct
	 */
    public function repoStats($repopath, $worktree, $commits_per_branch=0, $objects_per_commit=0) {

        #
        $repo_stats["path"] = $repopath;

        #
        if (!file_exists($repopath."/HEAD")) {
            #
            $repo_stats["ava"] = "!exist";
        } else {

            # Current repository status (GxTend)...
            $repo_stats["ava"] = self::getRepoStatus($repopath);

            # Current branch HEAD...
            # Working Tree Size...
            $giticmd = self::issuecommand("name-rev --name-only HEAD", $repopath, $worktree);
            if ($giticmd["sts"]==0) {
                $repo_stats["head"] = trim($giticmd["out"]);
            }

            # More in depth repo details...
            if ($commits_per_branch!==0) {

                # Load repository config entries...
                $giticmd = self::issuecommand("config --list", $repopath, $worktree);
                if ($giticmd["sts"]==0) {
                    foreach (explode("\n", $giticmd["out"]) as $ln) {
                        list($key,$val) = explode("=", $ln);
                        if (trim($key)) {
                        //$val = (trim($val)=="true" || trim($val)=="false") ? (trim($val)=="true" ? true : false) : trim($val);
                        $repo_stats["config"][trim($key)] = trim($val);
                        }
                    }
                }
                
                # Repo size in filesystem...
                foreach (InProve_File::find("(.*)", $repopath, 1) as $fl) {
                    $total_bytes_repo += filesize($fl);
                }
                $repo_stats["fsysSize"] = $total_bytes_repo;

                # Working Tree Size...
                if ($repo_stats["config"]["core.bare"]=="false") {
                    # Repo size in filesystem...
                    foreach (InProve_File::find("(.*)", $repopath."/../", 1) as $fl) {
                        $total_bytes += filesize($fl);
                    }
                    $repo_stats["fsysSizeOfWrkTree"] = $total_bytes - $total_bytes_repo;
                }

                # Branches...
                $giticmd = self::issuecommand("branch -a", $repopath, $worktree);
                if ($giticmd["sts"]==0) {
                    $repo_stats["personalBranch"] = "not found";
                    foreach (explode("\n", $giticmd["out"]) as $branchName) {
                    $branchName = trim(str_ireplace("*","",$branchName));
                    if ($branchName && $branchName!="(no branch)") {
                        if (stripos($branchName, "remotes/origin/HEAD")!==false) {
                            $repo_stats["remoteCurrentBranch"] = basename($branchName);
                        } else {
                            # Get some branch info..
                            $i = 0;
                            $history = InProve_Cvs::whatchanged("", $branchName, $repopath);
                            $repo_stats["branchInfo"][$branchName]["name"] = $branchName;
                            $repo_stats["branchInfo"][$branchName]["type"] = (stripos($branchName,"remotes/")!==false) ? "remote" : "local";
                            $repo_stats["branchInfo"][$branchName]["commits"] = count($history);
                            foreach ($history as $commitId => $commitData) {
                                if (++$i==1) {
                                $repo_stats["branchInfo"][$branchName]["lastcommit"] = $commitId;
                                }
                                $repo_stats["branchInfo"][$branchName]["commitsdata"][$commitId] = $commitData;
                                if ($objects_per_commit>0) {
                                    $repo_stats["branchInfo"][$branchName]["commitsdata"][$commitId]["changes"] = array_slice($commitData["changes"], 0, $objects_per_commit);
                                }
                                if ($commits_per_branch>0) {
                                    if ($i>=$commits_per_branch) { break; }
                                }
                            }

                            # Status of personal branch
                            if ($branchName == InProve_Session::getSessVar("MyProfile.userdata.username")) {
                                $repo_stats["personalBranch"] = "found";
                            }

                        }
                    }
                    }
                } else {
                    $repo_stats["branchInfo"] = $giticmd["sts"]." - ".$giticmd["out"];
                }
            }

        }

    return $repo_stats;
    }
     
     /*
     * Git repository related operations to set the repository in a specific status from the remote client point of view
     * 1. git specific parameter http.receivepack (boolean) controls wheter anonymous push is allowed by the git-http-backend
     * 2. magic file named 'git-daemon-export-ok' controls wheter the repository will be exported by the git-http-backend
      */
    public function getRepoStatus($repopath) {
        
        if (__LAYER_ROLE__=="Client") { return "open"; }

        if (file_exists($repopath)) {
            $magicfile = file_exists($repopath."/git-daemon-export-ok");
            $git_output = InProve_Git::issuecommand("config http.receivepack", $repopath); $receivepack = trim($git_output["out"]);
            
            if ($magicfile && $receivepack=="true") {
                $sts = "open";
            } elseif ($magicfile && $receivepack!="true") {
                $sts = "read";
            } elseif (!$magicfile && $receivepack!="true") {
                $sts = "close";
            }
        }

    return $sts;
    }

    /*
     * 
     */
    public function setRepoStatus($repopath, $sts) {
        
        if (file_exists($repopath)) {
            if ($sts == "open") {
                InProve_File::save($repopath."/git-daemon-export-ok", "Set on ".InProve_System::ts2str(time())." by ".InProve_Session::getSessVar("MyProfile.userdata.username"));
                $git_output = InProve_Git::issuecommand("config http.receivepack true", $repopath);
            } elseif ($sts == "read") {
                InProve_File::save($repopath."/git-daemon-export-ok", "Set on ".InProve_System::ts2str(time())." by ".InProve_Session::getSessVar("MyProfile.userdata.username"));
                $git_output = InProve_Git::issuecommand("config http.receivepack false", $repopath);
            } elseif ($sts == "close") {
                unlink($repopath."/git-daemon-export-ok");
                $git_output = InProve_Git::issuecommand("config http.receivepack false", $repopath);
            }
        }

    }
    
}

?>