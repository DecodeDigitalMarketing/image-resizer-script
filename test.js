const axios             =   require('axios').default;
const Jimp              =   require('jimp'); 
const querystring       =   require('querystring');
const { curly, Curl }   =   require('node-libcurl');
const { fs }            =   require('fs');

/**
 * @Todo get image proprety 
 * @Todo check the image size
 * @Todo download and resize it using a third party (Jimp)
 * @Todo search for related pages where the image was used
 * @Todo update the related image property on every path on thoses pages 
 * @Todo upload the new images.
 */

const COOKIE    = 'oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d%3acaf09ef0-c11b-4879-a2e5-4ce1ca9b0bef_8adfdb9317ba57925db6d10b8184e599%3acrx.default; aem-commonspirit="{0ff304881823c1fd60d224f02558d3da365d358eb28b810084e7936010033a1ad0dcd1ff4360d5b089b275d684d00a979332df494691f7bd2ed704326cbf40a12f47adb3e2770a245632f720388af00fb3ede32be13e4e470e86a8924109ee7ebe2677354b937933131289cb32fce3aa}"; oauth-authid=ims; cq-authoring-mode=TOUCH'
const crxde     = "https://author1.stage.commonspirit.adobecqms.net/crx/server/crx.default/jcr%3aroot/";

const availableMarkets = [
    { 
        market: "dignity-health",
        domain: "https://www.dignityhealth.org/"
    },
    {
        market: "stlukeshealth",
        domain: "https://www.stlukeshealth.org/"
    },
    {
        market: "stjoseph-stlukeshealth",
        domain: "https://stjoseph.stlukeshealth.org/"
    }
]

// async function getImages(market='stlukeshealth') {
//     try {
//         const resp = await curly.get(`${crxde}dam/${market}/images.1.json?_dc=1656519923105&node=xnode-284`, {
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
//         console.log(Object.keys(data));
//         return data; 
//     } catch (e) {
//         console.log(e);
//         console.log(e.message);
//         return []
//     }
// }

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

async function checkImageSize(path) {
    try {
        let imageProperty = await getImageMetaDataProperty(path); 
        imageProperty = JSON.parse(imageProperty);
        const size = imageProperty["dam:size"]; 
        
        if (size >= 5000 ) {
            console.log("Need to be reduce"); 
        } else {
            console.log("The image has a good size");
        }
        return size < 5000 ? true : false; 
    } catch (error) {
        return false;
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

async function getImages(imageName) {
    try {
        const dataSearch = await search(imageName); 
        if (dataSearch.results && !dataSearch.results.length) {
            throw new Error(`Image : ${imageName} is not found`);
        }
        const { results } = dataSearch; 
        const imagePaths = results.filter((item) => {
            return item.path.split("/").pop() === imageName; 
        });
        return imagePaths; 

    } catch (error) {
        console.log(error.message); 
        return [];
    }
}

async function reduceImage(path) {
    const baseUrl = `https://author1.stage.commonspirit.adobecqms.net`;
    try {
        const imgToDownload = await Jimp.read({
            url:`${baseUrl}${path}`,
            headers: {
                'Accept' : '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Cookie': `${COOKIE}`,
                'Origin': 'https://author1.stage.commonspirit.adobecqms.net',
                'Overwrite': 'T',
                'Referer': 'https://author1.stage.commonspirit.adobecqms.net/crx/de/index.jsp',
                "referrerPolicy": "strict-origin-when-cross-origin",
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            },
            rejectUnauthorized: false
        });
        
        const newImageName = path.split('/').pop().split('.')[0]; 
        const outpath = `/images/${newImageName}-${Math.floor(Math.random() * 2000)}.${imgToDownload.getExtension()}`;
        return imgToDownload.quality(60).writeAsync(__dirname + outpath); 
    } catch (error) {
        console.log(error.message); 
    }
}

async function processImageResizing(){
    const imagesPath = await getImages("woman-stretches-at-work.png");
    for (let img of imagesPath) {
        if (!await checkImageSize(img.path)) {
            await reduceImage(img.path); 
        }
    }
}

//getImages(); 

// getImages("12592675-l.jpg");
// getImages("woman-stretches-at-work.png");
// checkImageSize("stlukeshealth", "woman-stretches-at-work.png");
processImageResizing(); 
//console.log(__dirname);