<?php
/**
 * Zend Framework
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://framework.zend.com/license/new-bsd
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@zend.com so we can send you a copy immediately.
 *
 * @category   Zend
 * @package    Zend_Controller
 * @copyright  Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 */

/**
 * Zend_XmlRpc_Response
 */
require_once 'Zend/XmlRpc/Response.php';

/**
 * File response
 *
 * @uses Zend_XmlRpc_Response
 * @category Zend
 * @package  Zend_XmlRpc
 * @copyright  Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
 * @license    http://framework.zend.com/license/new-bsd     New BSD License
 * @version $Id: Http.php 20096 2010-01-06 02:05:09Z bkarwin $
 */
class Zend_XmlRpc_Response_File extends Zend_XmlRpc_Response
{
    /**
     * Override __toString() to send HTTP Content-Type header
     *
     * @return string
     */
    public function __toString()
    {
        if (!headers_sent()) {
            header('Content-Type: text/xml; charset=' . strtolower($this->getEncoding()));
        }

        $this->setReturnValue(self::xrz_response());
        
        return parent::__toString();
    }

    /**
     * Save server's response to file...
     *
     * @return struct
     */
    private function xrz_response() {

        $sts = false;
        $msg = "Error generating response file.";
        $xrzfile = null;
        $xrzsize = 0;
        $respfile = InProve_Session::getSessVar("MyProfile.tmpdir")."/".InProve_System::get_guid($_SERVER["REMOTE_ADDR"]);
        $sersize = InProve_File::save($respfile.".ser", serialize(parent::getReturnValue()));
        if ($sersize > (1024*64)) {
            #
            $zipStatus = InProve_Zip::archive($respfile.".xrz", array($respfile.".ser"));
            if ($zipStatus["sts"]!==false) {
                $sts = true;
                $msg = "Response file successfully generated.";
                $xrzfile = $respfile.".xrz";
                $xrzsize = filesize($respfile.".xrz");
            }
            unlink($respfile.".ser");
        } else {
            unlink($respfile.".ser");
            return parent::getReturnValue();
        }

        #
        $response["start"] = $_SERVER["REQUEST_TIME"];
        $response["sts"] = $sts;
        $response["msg"] = $msg;
        $response["xrzfile"] = base64_encode($respfile.".xrz");
        $response["xrzsize"] = $xrzsize;
        $response["sersize"] = $sersize;
        $response["end"] = time();

    return $response;
    }

}
