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
        $InProve_BE_HOME = InProve_System::get_eva("InProve_BE_HOME");

        # Set git environment variables...
        if (file_exists($repopath) && ($worktree===null || $worktree==="null" || file_exists($worktree))) {
            #
            putenv("GIT_DIR=$repopath");
            if ($worktree!==null) { InProve_System::get_eva("GIT_WORK_TREE", $worktree); }
            #
            InProve_System::get_eva("GIT_AUTHOR_NAME", "Unknown");
            InProve_System::get_eva("GIT_AUTHOR_EMAIL", "Unknown");
            InProve_System::get_eva("GIT_COMMITTER_NAME", InProve_Session::getSessVar("MyProfile.userdata.username"));
            InProve_System::get_eva("GIT_COMMITTER_EMAIL", InProve_Session::getSessVar("MyProfile.userdata.email"));
            #
            list($cmdsts, $cmdout) = InProve_System::shell_exec("\"$InProve_BE_HOME/Git/bin/git.exe\" $command");

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
                    "InProve_BE_HOME"=>$InProve_BE_HOME,
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
            if (!file_exists($repopath."/status")) {
                $repo_stats["ava"] = "open";
            } else {
                $repo_stats["ava"] = trim(basename(InProve_File::read($repopath."/status")));
            }

            # Current branch HEAD...
            # Working Tree Size...
            $giticmd = self::issuecommand("name-rev --name-only HEAD", $repopath, $worktree);
            if ($giticmd["sts"]==0) {
                $repo_stats["head"] = $giticmd["out"];
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

}

?>