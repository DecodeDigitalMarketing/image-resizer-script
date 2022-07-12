const { curly, Curl }               =   require('node-libcurl');
const XLSX                          =   require("xlsx");
const { crxde, options }    =   require("./config/env-config");

// const COOKIE    = 'cq-authoring-mode=TOUCH; __loc=TX%7CUS; fabrickId=E1%3AOh-QFJUIqpR_ZphvJz7PCmtpJ84WlV1zHq57dqvUBRCkkEwZjEag_NtuCGpH93jI04yw5YQQzktA7Vg8tO1hnHrS2oQTE4pvtfiFA5JNK0KS5tKLoV7wZ1SXte6Mt6ictxGaC8sA2Lx3vPoxLag6jw; cq-editor-layer.page=Edit; adcloud={%22_les_v%22:%22y%2Cadobecqms.net%2C1657574399%22}; AMCV_E13D51085E59F02C0A495CDC%40AdobeOrg=-2121179033%7CMCIDTS%7C19185%7CMCMID%7C82662739415969301494412556172947609393%7CMCAAMLH-1658177399%7C9%7CMCAAMB-1658177399%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1657579799s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; utag_main=v_id:0181d4682ee0001ff0f496ad57060506f00a306700bd0$_sn:3$_ss:1$_st:1657574400540$vapi_domain:adobecqms.net$dc_visit:3$ses_id:1657572600540%3Bexp-session$_pn:1%3Bexp-session$dc_event:1%3Bexp-session$dc_region:us-east-1%3Bexp-session; oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d%3aa5da567d-726f-436e-be91-648d292778fd_8f17274823416e5250d858b96819d5cd%3acrx.default; aem-commonspirit="{8a4dae48b51332df2e6fec8490ca6c2d4f43b0b09a878c215224339f6c955c830826945a99fb99704409e48e21d6d6f68393532867f96722661df797c386b87f998f6d3d84ab60baba7c462d4a0558c895f4ce5c1b8e76fd98627483a9ad87a30bf4d56d4011ba3349e56cf8b934e991}"; oauth-authid=ims; AMCVS_8F99160E571FC0427F000101%40AdobeOrg=1; lang=en%3Aus; s_cc=true; wcmmode=edit; AMCV_8F99160E571FC0427F000101%40AdobeOrg=1687686476%7CMCIDTS%7C19185%7CMCMID%7C89156023496090199653760977611407146345%7CMCAAMLH-1658246969%7C9%7CMCAAMB-1658246969%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-613026243%7CMCOPTOUT-1657649325s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.0.0; s_sq=%5B%5BB%5D%5D'
// const crxde     = "https://author1.stage.commonspirit.adobecqms.net/crx/server/crx.default/jcr%3aroot/";

async function getImagesInDam() {
    try {
        const resp = await curly.get(`${crxde}content/dam.1.json`, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return null;
        } 

        const result = JSON.parse(data);
        const excludeIndex = [ 
            ':jcr:creadted', 
            ':jcr:primaryType', 
            'jcr:created', 
            ':jcr:created',
            'jcr:createdBy', 
            'jcr:primaryType', 
            ':jcr:mixinTypes', 
            'jcr:content',
            '::NodeIteratorSize',
            'jcr:mixinTypes' 
        ];

        if (result['jcr:primaryType'] == 'sling:Folder') {
            for(const res in result) {
                if(excludeIndex.indexOf(res) == -1) {
                    await getAllImages(res, '/dam'); 
                }
            }
        }
        
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

function isHeavy(image) {
    return (image["dam:size"] && image["dam:size"] > 250000) ? true : false; 
}

async function getAllImages(folder, parentFolderpath) {
    try {
            const path = `${parentFolderpath}/${folder}`;
            const resp = await curly.get(`${crxde}content${encodeURI(path)}.1.json`, options);

            const { statusCode, data } = resp
            if (statusCode != 200) {
                return null;
            } 

            const result = JSON.parse(data);
            const excludeIndex = [ 
                ':jcr:creadted', 
                ':jcr:primaryType', 
                'jcr:created', 
                ':jcr:created',
                'jcr:createdBy', 
                'jcr:primaryType', 
                ':jcr:mixinTypes', 
                'jcr:content',
                '::NodeIteratorSize',
                'jcr:mixinTypes' 
            ];

            const heavyImages = [];

            const patternFile = new RegExp('(jpg|jpeg|png|svg|pdf|xml)$','g');
            const patternImage = new RegExp('(jpg|jpeg|png|svg)$','g');

            if (result['jcr:primaryType'] == 'sling:Folder') {
                for(const res in result) {
                    if(excludeIndex.indexOf(res) == -1 && !patternFile.test(res)) {
                        await getAllImages(res, `${parentFolderpath}/${folder}`); 
                    } else if(excludeIndex.indexOf(res) == -1 && patternImage.test(res)) {
                        const image = await getImageMetaDataProperty(`${parentFolderpath}/${folder}/${res}`);
                        if (isHeavy(image)) {
                            
                        }
                    }
                }
            } 
            else {
                if (result['jcr:primaryType'] == 'dam:Asset' && patternImage.test(folder)) {
                    const image = await getImageMetaDataProperty(`${parentFolderpath}/${folder}`);
                    if (isHeavy(image)) {
                        
                    }
                }
            }
        } catch (error) {
            console.log(error.message);
            return null;
    }
}



// async function getImages(market='stlukeshealth') {
//     try {
//         const resp = await curly.get(`${crxde}content/dam/${market}/images.1.json?_dc=1656519923105&node=xnode-284`, {
//             httpHeader: [
//                 'Accept: */*',
//                 'Accept-Language: en-US,en;q=0.9',
//                 'Connection: keep-alive',
//                 `Cookie: ${COOKIE}`,
//                 'Origin: https://author1.stage.commonspirit.adobecqms.net',
//                 'Overwrite: T',
//                 'Referer: https://author1.stage.commonspirit.adobecqms.net/crx/de/index.jsp',
//                 'Sec-Fetch-Dest: empty',
//                 'Sec-Fetch-Mode: cors',
//                 'Sec-Fetch-Site: same-origin',
//                 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
//                 'X-Requested-With: XMLHttpRequest',
//                 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
//                 'sec-ch-ua-mobile: ?0',
//                 'sec-ch-ua-platform: "macOS"'
//             ],
//             sslVerifyPeer: false
//         });

//         const { statusCode, data } = resp
//         if (statusCode != 200) {
//             return [];
//         } 
//         return JSON.parse(data); 
//     } catch (e) {
//         console.log(e);
//         console.log(e.message);
//         return []
//     }
// }

async function getImageMetaDataProperty(path) {
    try {
        const url = `${crxde}content${encodeURI(path)}/jcr%3Acontent/metadata.1.json`;
        console.log("URL REQUEST : ", url);
        const resp = await curly.get(url, options);

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

// getPagesWithHeavyImages('stjoseph-stlukeshealth'); 
//getImages(); 
getImagesInDam(); 