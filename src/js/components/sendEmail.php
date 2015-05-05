<?php

if( !isset($_POST['haricolor']) ) {

        $from_email = $_POST['email'];
        $name = $_POST['name'];
        $subject = $_POST['subject'];
        $comment = $_POST['userMessage'];
        $to_email = "lcotner@blueraster.com";

        echo ($comment);

        // create email headers

        #$headers = 'From: '.$geoodk_email."\r\n".'Reply-To: '.$email_from."\r\n".'X-Mailer: PHP/'.phpversion();

        //$from_email = "admin@landmarkmap.org";
        // $name = "Jon";
        // $subject = "Subject";
        // $comment = "Comment";
        // $to_email = "lcotner@blueraster.com";

        $message = "Name: ".$name."\r\n";
        $message .= "Subject: ".$subject."\r\n";
        $message .= "Email: ".$from_email."\r\n\r\n";
        $message .= "Message: ".$comment;

        $headers = "From: ".$from_email. "\r\n" ."Reply-To: lc07@uw.edu" . "\r\n";

        
        echo($try);
        #@mail($geoodk_email, $email_subject, $email_message, $headers); 
        #$t= @mail($to_email , $subject , $message, $headers);

    if(mail($to_email, $subject, $message, $headers))
    {
      echo "Mail Sent Successfully";
    }else{
      echo "Mail Not Sent";
    }
    echo($t);
            #echo"Sent Mail";


}else{
        echo "Not Sent";
}

#echo"Sent Mail";


?>