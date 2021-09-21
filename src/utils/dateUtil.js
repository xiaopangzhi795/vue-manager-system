/* 产引入jsencrypt实现数据RSA加密 */
import JSEncrypt from 'jsencrypt' // 处理长文本数据时报错 jsencrypt.js Message too long for RSA
/* 产引入encryptlong实现数据RSA加密 */
import Encrypt from 'encryptlong' // encryptlong是基于jsencrypt扩展的长文本分段加解密功能。
// aes 对称加密
import CryptoJS from "crypto-js";
import CryptoJS2 from 'crypto-js/crypto-js'
import md5 from 'js-md5';
import da from "element-plus/packages/locale/lang/da";

const publicKey = "-----BEGIN PUBLIC KEY-----\n" +
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjaO9DcW5gpEa9q1noHhri7EES\n" +
    "8iiiubzRv1vgW14S+BceXUvZQdUVZpm62v+ZIXULT64HzdQurC9jzp8i1+EHOC++\n" +
    "kTc5wdD2k/n2Mmiu9WVdpOXrXvNJLY03SYhpZOkoxecxrI2BqZ8qk7VDyK7V7UCQ\n" +
    "vacKoR4Sz/HnVfVwrQIDAQAB\n" +
    "-----END PUBLIC KEY-----";
const privateKey = "-----BEGIN PRIVATE KEY-----\n" +
    "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAONo70NxbmCkRr2r\n" +
    "WegeGuLsQRLyKKK5vNG/W+BbXhL4Fx5dS9lB1RVmmbra/5khdQtPrgfN1C6sL2PO\n" +
    "nyLX4Qc4L76RNznB0PaT+fYyaK71ZV2k5ete80ktjTdJiGlk6SjF5zGsjYGpnyqT\n" +
    "tUPIrtXtQJC9pwqhHhLP8edV9XCtAgMBAAECgYASLPLimxBNXRPiWO2opa9Ub7mL\n" +
    "wBsLVnkG8ppvRh4wue9vF9nWFXLocPjcfGBtZsUqEEZCjWrmCBEJkxwY9tQfTwD/\n" +
    "60Uzelt5jNWuIKyA16351HQa0mu0Y6Q8jrTXfwNA2vGTdyGojDRG4xCv7vh6UgyQ\n" +
    "HLx/XYUE1KEHvWl7wQJBAPmOi7w07rRYjjGW/FxwtddgOnPvgMERyBh7Jw9dQKmN\n" +
    "GDkkf6rSF9Z4EIdrlu4+imyouAgtvuisIsM7+m0gAuUCQQDpSAILAiiqy/x0zPwR\n" +
    "EyukxgRIOsb2UP6GIi6UnThg6CSUEgvNSN6KroatZWL5HHZjOc5Iv8Q98vJprNEg\n" +
    "r3IpAkEA7NqO40U13XNDGevcfvv2ioDpWYnSIOx4hku0ac+vBH1GpU1v4jfeqg5w\n" +
    "WacSq/ItvS1w5UpNrFVb9QKjDxlXxQJBALngGViiKLsmfAqpBjOovb611NWkl8HN\n" +
    "+W/xLoJV34U/k120H1k7ta50r3Tb8wegySf4+Ef5HKlrugG/pIZRpTkCQQC+BBhx\n" +
    "2vQ88fivdCRYZwnXT0YeFBoHfFkgEqaxeTdBZhrkYlZRtmFSBosibOxP6dAqMa6q\n" +
    "ib/ROfwk7ph6qf1S\n" +
    "-----END PRIVATE KEY-----";

const aeskey = "hellohellohello1";
const aesiv = "encryptionIntVec";

export default {
    /* JSEncrypt加密 */
    rsaPublicData(data) {
        var jsencrypt = new JSEncrypt()
        jsencrypt.setPublicKey(publicKey)
        // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
        var result = jsencrypt.encrypt(data)
        return result
    },
    /* JSEncrypt解密 */
    rsaPrivateData(data) {
        var jsencrypt = new JSEncrypt()
        jsencrypt.setPrivateKey(privateKey)
        // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
        var result = jsencrypt.decrypt(data)
        return result
    },
    /* 加密 */
    encrypt(data) {
        const PUBLIC_KEY = publicKey
        var encryptor = new Encrypt()
        encryptor.setPublicKey(PUBLIC_KEY)
        // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
        const result = encryptor.encryptLong(data)
        return result
    },
    /* 解密 - PRIVATE_KEY - 验证 */
    decrypt(data) {
        const PRIVATE_KEY = privateKey
        var encryptor = new Encrypt()
        encryptor.setPrivateKey(PRIVATE_KEY)
        // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
        var result = encryptor.decryptLong(data)
        return result
    },
    // 加密
    aesEncrypt(word, aesKey, aesIv) {
        let key = CryptoJS.enc.Utf8.parse(aesKey);
        let iv = CryptoJS.enc.Utf8.parse(aesIv);

        let encrypted = CryptoJS.AES.encrypt(word, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },
    // 解密
    aesDecrypt(word, aesKey, aesIv) {
        let key = CryptoJS.enc.Utf8.parse(aesKey);
        let iv = CryptoJS.enc.Utf8.parse(aesIv);

        var decrypt = CryptoJS.AES.decrypt(word, key, {
            iv:iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypt);
    },
    enMd5_16(data){
        let encode = md5(data);
        return encode.substr(8, 16);
    },
    enMd5_32(data){
        let encode = md5(data);
        return encode;
    },
    hmac(data, hmacKey) {
        // str 是按照网站或者自己的规则拼接的字符串，像币安里面就是将传递的参数拼接成字符串
        // key 是网站设置的秘钥，像币安就是secretKey
        // 此方法为HMAC-SHA256的签名方式
        console.log(hmacKey);
        let key = CryptoJS.enc.Hex.parse(hmacKey);
        let test = CryptoJS.HmacSHA256(data, hmacKey);
        console.log("encode is : // "+test.toString());
        // 使用16进制的方法加密，输出字符串
        // let testStr = CryptoJS2.HmacSHA256(data, test).toString();
        let testStr = CryptoJS.enc.Base64.stringify(test);
        // testStr = CryptoJS.enc.Hex.stringify(testStr);

        return testStr;
    }
}