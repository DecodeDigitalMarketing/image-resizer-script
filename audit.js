const { curly, Curl }   =   require('node-libcurl');
const XLSX              =   require("xlsx");

const COOKIE    = 'cq-authoring-mode=TOUCH; AMCV_E13D51085E59F02C0A495CDC%40AdobeOrg=-2121179033%7CMCIDTS%7C19180%7CMCMID%7C82662739415969301494412556172947609393%7CMCAAMLH-1657730806%7C9%7CMCAAMB-1657730806%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1657133206s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; __loc=TX%7CUS; fabrickId=E1%3AOh-QFJUIqpR_ZphvJz7PCmtpJ84WlV1zHq57dqvUBRCkkEwZjEag_NtuCGpH93jI04yw5YQQzktA7Vg8tO1hnHrS2oQTE4pvtfiFA5JNK0KS5tKLoV7wZ1SXte6Mt6ictxGaC8sA2Lx3vPoxLag6jw; cq-editor-layer.page=Edit; adcloud={%22_les_v%22:%22y%2Cadobecqms.net%2C1657231413%22}; utag_main=v_id:0181d4682ee0001ff0f496ad57060506f00a306700bd0$_sn:2$_ss:0$_st:1657231413780$vapi_domain:adobecqms.net$dc_visit:2$ses_id:1657229364835%3Bexp-session$_pn:4%3Bexp-session$dc_event:4%3Bexp-session$dc_region:us-east-1%3Bexp-session; oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d%3a5f34583a-bcc2-435e-8ff0-c18442e3b297_17ecc320d2a0d8eb93f845d0ff5d4fb8%3acrx.default; aem-commonspirit="{2266af00c30339275a5d57c747a92e8569a54f7ec96cb25a6a404c5af1feb85ebc78684019a73becca5e158dcbe13d2bcfc3097ea88c767c6a623695bb8d0770f09ec7a5ea997ec4b4da229cebfeb5aa54dedca64839b09acf2fbadabbad3e919a89bfab7566da3d0d2a69768a101488}"; oauth-authid=ims; AMCVS_8F99160E571FC0427F000101%40AdobeOrg=1; lang=en%3Aus; s_cc=true; AMCV_8F99160E571FC0427F000101%40AdobeOrg=1687686476%7CMCIDTS%7C19185%7CMCMID%7C89156023496090199653760977611407146345%7CMCAAMLH-1658152675%7C9%7CMCAAMB-1658152675%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-613026243%7CMCOPTOUT-1657555072s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.0.0; so_ppn=aem%3Asites%3Apages%3Apage'
const crxde     = "https://author1.stage.commonspirit.adobecqms.net/crx/server/crx.default/jcr%3aroot/";

async function getImages(market='stlukeshealth') {
    try {
        const resp = await curly.get(`${crxde}content/dam/${market}/images.1.json?_dc=1656519923105&node=xnode-284`, {
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
        });

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return [];
        } 
        return JSON.parse(data); 
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return []
    }
}

async function getImageMetaDataProperty(path) {
    try {
        const resp = await curly.get(`${crxde}${path}/jcr%3Acontent/metadata.1.json`, {
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
        });

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return [];
        } 
        //console.log(data);
        return data; 
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return []
    }
}

async function search(imageName) {
    try {
        const searchUrl = 'https://author1.stage.commonspirit.adobecqms.net/crx/de/search.jsp'
        const resp = await curly.get(`${searchUrl}?_dc=1656531436482&query=${imageName}&start=1&limit=100&_charset_=utf-8`, {
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
        });

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return [];
        } 
        console.log(data);
        return data; 
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return {}; 
    }
}

// size in bytes
async function getPagesWithHeavyImages(market='stlukeshealth') {
    try {
        const images = await getImages(market); 
        let pathObj = [["Image Name", "Paths"]];
        for(let img in images) {
            if (images[img]['jcr:primaryType'] === 'dam:Asset') {
                const path = `content/dam/${market}/images/${img}`;
                const property = await getImageMetaDataProperty(path); 
                const parseData = (typeof property === 'string') ? JSON.parse(property) : property; 
                if (parseData["dam:size"] && parseData["dam:size"] > 250000) {
                    const searchResult = await search(img); 
                    searchResult.results.forEach((item) => {
                        pathObj.push([img, item.path]);
                    });
                }
            }
        }
        //console.log(pathObj);
        //fs.writeFileSync('./paths.json', JSON.stringify(pathObj)); 
        const worksheet = XLSX.utils.aoa_to_sheet(pathObj); 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "StJoseph");
        XLSX.writeFile(workbook, "image-audit.xlsx");

    } catch (error) {
        console.log(error.message);
    }
}

getPagesWithHeavyImages('stjoseph-stlukeshealth'); 
//getImages(); 