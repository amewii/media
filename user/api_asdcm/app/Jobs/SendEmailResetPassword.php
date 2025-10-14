<?php

namespace App\Jobs;

use App\Models\med_tetapan;
use App\Models\med_users;
use Exception;
use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\PHPMailer;

class SendEmailResetPassword extends Job
{
    /**
     * Create a new job instance.
     *
     * @return void
     */

    public $no_kad_pengenalan;
    public $masa;
    public $landing_page;
    public $enc_link;
    public $emel_kerajaan;
    public $emel;
    public $nama;

    public function __construct($data)
    {
        $this->no_kad_pengenalan = $data['no_kad_pengenalan'];
        $this->masa = $data['masa'];
        $this->landing_page = $data['landing_page'];
        $this->enc_link = $data['enc_link'];
        $this->emel_kerajaan = $data['emel_kerajaan'];
        $this->emel = $data['emel'];
        $this->nama = $data['nama'];
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $med_users = med_users::where('no_kad_pengenalan',$this->no_kad_pengenalan)->update([
                'resetkatalaluan' => $this->enc_link
            ]);
            
            if ($med_users)  {
                $tetapan_mail = med_tetapan::first();
                $env = request()->getHost();
    
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = $env == 'localhost' ? 'smtp.mailtrap.io' : $tetapan_mail->mail_gateway;
                if ($env == 'localhost') {
                    $mail->SMTPAuth = true;
                    $mail->Username = config('app.MAIL_USERNAME'); // copy from Mailtrap
                    $mail->Password = config('app.MAIL_PASSWORD'); // copy from Mailtrap
                    $mail->SMTPSecure = 'tls';
                }
                $mail->Port = $env == 'localhost' ? config('app.MAIL_PORT') : $tetapan_mail->mail_port;
    
                $mail->setFrom('media@intanbk.intan.my', 'Admin Galeri INTAN');
                $this->emel_kerajaan ? $mail->addAddress($this->emel_kerajaan) : '';
                $mail->addAddress($this->emel);
                $mail->isHTML(true);
                $mail->Subject = 'PENGURUSAN MEDIA - SET SEMULA KATALALUAN';
                $mail->Body = '<b>Set Semula Katalaluan</b><br><br>
                                    Assalamualaikum dan salam sejahtera<br>
                                    '.$this->nama.'<br><br>
                                    Anda telah membuat permintaan menetapkan semula kata laluan. <br>
                                    Sekiranya anda tidak membuat permintaan ini, silakan abaikan emel ini. <br>
                                    Sekiranya anda membuat permintaan ini, sila klik pautan dibawah untuk tetapkan semula katalaluan anda:<br><br>
                                    <a href="'.$tetapan_mail->link_sistem.$this->landing_page.'/?temp='.$this->enc_link.'">Set Semula Katalaluan</a><br><br>
                                    Terima kasih.';
                $mail->AltBody = 'Alternate Message';
                $mail->send();
            }
        } catch (Exception $e) {
            Log::error($e);
        }
    }
}
