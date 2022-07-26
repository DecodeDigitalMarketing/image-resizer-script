const COOKIE    = 'cq-authoring-mode=TOUCH; AMCV_E13D51085E59F02C0A495CDC%40AdobeOrg=-2121179033%7CMCIDTS%7C19193%7CMCMID%7C82662739415969301494412556172947609393%7CMCAAMLH-1658870270%7C9%7CMCAAMB-1658870270%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1658272670s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; fabrickId=E1%3AOh-QFJUIqpR_ZphvJz7PCmtpJ84WlV1zHq57dqvUBRCkkEwZjEag_NtuCGpH93jI04yw5YQQzktA7Vg8tO1hnHrS2oQTE4pvtfiFA5JNK0KS5tKLoV7wZ1SXte6Mt6icAFxeg8pBldreTHtgFBKs9w; cq-editor-layer.page=Edit; adcloud={%22_les_v%22:%22y%2Cadobecqms.net%2C1658357068%22}; utag_main=v_id:0182185304a80017443f0fbe9e950506f006606700bd0$_sn:8$_ss:0$_st:1658358463504$vapi_domain:adobecqms.net$dc_visit:8$ses_id:1658355088943%3Bexp-session$_pn:7%3Bexp-session$dc_event:26%3Bexp-session$dc_region:us-east-1%3Bexp-session; AMCV_8F99160E571FC0427F000101%40AdobeOrg=1687686476%7CMCIDTS%7C19196%7CMCMID%7C89156023496090199653760977611407146345%7CMCAAMLH-1659111530%7C9%7CMCAAMB-1659111530%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-613026243%7CMCOPTOUT-1658513927s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.0.0; mcxSurveyQuarantine=mcxSurveyQuarantine; oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d%3a22e00761-a1c3-4896-8950-5de2afd51a45_e071a27ed7300727d67b334296266478%3acrx.default; aem-commonspirit="{3dcba7ddfc0156b749e5d0f709fc7d0ca28113d7b09dcf9a09720aa43c1ff81ca96c14207aad2a55b5ed94f33b761e0d51dc2fa2cdd83f8f038511340fd9c74bad8f1c983efdafdd294823f3acd6d617ddf0070ee15616256c98882e2361fa2a7eb972c419e9e97d7a2b87f68f781c5d}"; oauth-authid=ims';

module.exports = {
    cookie : COOKIE,
    crxde  : "https://author1.stage.commonspirit.adobecqms.net/crx/server/crx.default/jcr%3aroot/",
    options: {
        httpHeader: [
            'Accept: */*',
            'Accept-Language: en-US,en;q=0.9',
            'Connection: keep-alive',
            `Cookie: ${COOKIE}`,
            'Origin: https://author1.stage.commonspirit.adobecqms.net',
            'Overwrite: T',
            'Referer: https://author1.stage.commonspirit.adobecqms.net/crx/de/index.jsp',
            'Sec-Fetch-Dest: empty',
            'Sec-Fetch-Mode: cors',
            'Sec-Fetch-Site: same-origin',
            'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
            'X-Requested-With: XMLHttpRequest',
            'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
            'sec-ch-ua-mobile: ?0',
            'sec-ch-ua-platform: "macOS"'
        ],
        sslVerifyPeer: false
    }
}