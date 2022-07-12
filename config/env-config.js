const COOKIE    = 'cq-authoring-mode=TOUCH; __loc=TX%7CUS; fabrickId=E1%3AOh-QFJUIqpR_ZphvJz7PCmtpJ84WlV1zHq57dqvUBRCkkEwZjEag_NtuCGpH93jI04yw5YQQzktA7Vg8tO1hnHrS2oQTE4pvtfiFA5JNK0KS5tKLoV7wZ1SXte6Mt6ictxGaC8sA2Lx3vPoxLag6jw; cq-editor-layer.page=Edit; adcloud={%22_les_v%22:%22y%2Cadobecqms.net%2C1657574399%22}; AMCV_E13D51085E59F02C0A495CDC%40AdobeOrg=-2121179033%7CMCIDTS%7C19185%7CMCMID%7C82662739415969301494412556172947609393%7CMCAAMLH-1658177399%7C9%7CMCAAMB-1658177399%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1657579799s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; utag_main=v_id:0181d4682ee0001ff0f496ad57060506f00a306700bd0$_sn:3$_ss:1$_st:1657574400540$vapi_domain:adobecqms.net$dc_visit:3$ses_id:1657572600540%3Bexp-session$_pn:1%3Bexp-session$dc_event:1%3Bexp-session$dc_region:us-east-1%3Bexp-session; oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d%3aa5da567d-726f-436e-be91-648d292778fd_8f17274823416e5250d858b96819d5cd%3acrx.default; aem-commonspirit="{8a4dae48b51332df2e6fec8490ca6c2d4f43b0b09a878c215224339f6c955c830826945a99fb99704409e48e21d6d6f68393532867f96722661df797c386b87f998f6d3d84ab60baba7c462d4a0558c895f4ce5c1b8e76fd98627483a9ad87a30bf4d56d4011ba3349e56cf8b934e991}"; oauth-authid=ims; AMCVS_8F99160E571FC0427F000101%40AdobeOrg=1; lang=en%3Aus; s_cc=true; wcmmode=edit; AMCV_8F99160E571FC0427F000101%40AdobeOrg=1687686476%7CMCIDTS%7C19185%7CMCMID%7C89156023496090199653760977611407146345%7CMCAAMLH-1658246969%7C9%7CMCAAMB-1658246969%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-613026243%7CMCOPTOUT-1657649325s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.0.0; s_sq=%5B%5BB%5D%5D';

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