<?php

namespace App\Jobs;

use Exception;
use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\PHPMailer;

class SendRegistrationEmail extends Job
{
    /**
     * Create a new job instance.
     *
     * @return void
     */

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $env = $this->data['env'];

        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $env == 'localhost' ? 'smtp.mailtrap.io' : $this->data['mail_gateway'];
            if ($env == 'localhost') {
                $mail->SMTPAuth = true;
                $mail->Username = config('app.MAIL_USERNAME'); // copy from Mailtrap
                $mail->Password = config('app.MAIL_PASSWORD'); // copy from Mailtrap
                $mail->SMTPSecure = 'tls';
            }
            $mail->Port = $env == 'localhost' ? config('app.MAIL_PORT') : $this->data['mail_port'];

            $mail->setFrom('media@intanbk.intan.my', 'Admin Galeri INTAN');
            $mail->addAddress($this->data['emel']);
            $mail->isHTML(true);
            $mail->Subject = 'PENGURUSAN MEDIA - PENDAFTARAN AKAUN PENGGUNA';
            $mail->Body    = isset($this->data['body']) ? $this->data['body'] :
                                '<b>Pendaftaran Akaun Pengguna</b><br><br>
                                Assalamualaikum dan salam sejahtera<br>
                                '.$this->data['nama'].'<br><br>
                                Tahniah! Anda berjaya mendaftar akaun. <br>
                                Sekiranya anda tidak membuat permintaan ini, silakan abaikan emel ini. <br>
                                Sekiranya anda membuat permintaan ini, Sila klik pautan dibawah untuk masuk ke dalam sistem:<br><br>
                                No. Kad Pengenalan: '. $this->data['no_kad_pengenalan'] .'<br>
                                Katalaluan: '. $this->data['kata_laluan'] .'<br><br>
                                <a href="'.$this->data['link_sistem'].'/user">Galeri Media INTAN Malaysia</a><br><br>
                                Terima kasih.';
            $mail->AltBody = 'Alternate Message';
            $mail->send();
        } catch (Exception $e) {
            Log::error($e);
        }
    }
}
