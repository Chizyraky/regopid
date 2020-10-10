// import { QRCode, ErrorCorrectLevel, QRNumber, QRAlphaNum, QR8BitByte, QRKanji } from "qrcode-generator";
import * as qrGenerator from 'qrcode-generator';
import { Injectable } from '@nestjs/common';
import { AesGcmService } from '@nestrx/aes-gcm';


function myFunc() {
    // @ts-ignore
    const qr = qrGenerator.default(0, 'H');
    qr.addData('Hello, world!');
    qr.make();
}

function componentDidLoad() {
    const typeNumber = 4 as TypeNumber;
    const errorCorrectionLevel = 'L' as ErrorCorrectionLevel;
    const qr = qrGenerator(typeNumber, errorCorrectionLevel);
    qr.addData('Hi!');
    qr.make();
    document.getElementById('placeHolder').innerHTML = qr.createImgTag();
}

@Injectable()
export class QrService {
    constructor(
        // public readonly aes: AesGcmService
    ) {
    }

    // encrypt(text: string): string {
    //     return this.aes.encrypt(text);
    // }

    // decryption(encrypted: string): string {
    //     return this.aes.decrypt(encrypted);
    // }

    // md5(text: string): string {
    //     return this.aes.md5(text);
    // }

    // // Generate AES_SECRET_KEY or the random string base64
    // generate() {
    //     console.log(this.aes.generateRandomKey());
    // }

    componentDidLoad(data: string) {
        const typeNumber = 4 as TypeNumber;
        const errorCorrectionLevel = 'L' as ErrorCorrectionLevel;
        const qr = qrGenerator(typeNumber, errorCorrectionLevel);
        qr.addData(data);
        qr.make();
        return qr.createImgTag();
    }
}