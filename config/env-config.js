const COOKIE    = 'AMCV_8F99160E571FC0427F000101@AdobeOrg=1687686476|MCIDTS|19196|MCMID|89156023496090199653760977611407146345|MCAAMLH-1659111530|9|MCAAMB-1659111530|RKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y|MCCIDH|-613026243|MCOPTOUT-1658513927s|NONE|MCAID|NONE|vVersion|3.0.0; mcxSurveyQuarantine=mcxSurveyQuarantine; cq-authoring-mode=TOUCH; oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d:cbcee48b-b80a-4903-ac9e-c4d894910128_7bbc82b1aa908b22348d2392a2977cbf:crx.default; aem-commonspirit="{e86e5a6826fd78c0356b00ca7d88f579efde98806d995ec2802c83d876a183f363dc593d693aa039ecbfec4d16e60a20894aefd0f6d282f19af8cd0ba1c4fa5860bb0e2aca3f8517ff1f442be43a7c90df7b4c1313252ac0c5424714802a20c7df42c61ea74502ed25f767405e399efb}"; oauth-authid=ims; adcloud={"_les_v":"y,adobecqms.net,1659017760"}; AMCVS_E13D51085E59F02C0A495CDC@AdobeOrg=1; AMCV_E13D51085E59F02C0A495CDC@AdobeOrg=-2121179033|MCIDTS|19202|MCMID|82662739415969301494412556172947609393|MCAAMLH-1659620760|7|MCAAMB-1659620760|RKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y|MCOPTOUT-1659023160s|NONE|MCAID|NONE|vVersion|5.3.0; fabrickId=E1:Oh-QFJUIqpR_ZphvJz7PCmtpJ84WlV1zHq57dqvUBRCkkEwZjEag_NtuCGpH93jI04yw5YQQzktA7Vg8tO1hnHrS2oQTE4pvtfiFA5JNK0KS5tKLoV7wZ1SXte6Mt6icifRW3ckW350ICGMA4GuU5w; utag_main=v_id:0182185304a80017443f0fbe9e950506f006606700bd0$_sn:9$_ss:0$_st:1659017761333$vapi_domain:adobecqms.net$dc_visit:9$ses_id:1659015960782;exp-session$_pn:1;exp-session$dc_event:2;exp-session$dc_region:us-east-1;exp-session';

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