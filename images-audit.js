const { curly, Curl }               =   require('node-libcurl');
const XLSX                          =   require("xlsx");
const { crxde, options }            =   require("./config/env-config");

const excludeIndex = [ 
    ':jcr:primaryType', 
    'jcr:created', 
    ':jcr:created',
    'jcr:createdBy', 
    'jcr:primaryType', 
    ':jcr:mixinTypes', 
    'jcr:content',
    '::NodeIteratorSize',
    'jcr:mixinTypes',
    'jcr:lastModifiedBy',
    ':jcr:lastModifiedBy',
    ':jcr:lastModified',
    'jcr:lastModified',
    'cq:lastReplicationAction',
    'cq:lastReplicatedBy',
    ':cq:lastReplicated',
    'cq:lastReplicated'
];

const allImagesPaths = [];

function isHeavy(image) {
    if (image["dam:size"] && image["dam:size"] > 250000) {
        return true;
    }
    return false; 
}

function checkIfFolder(objectname) {
    const patternFile   = new RegExp('(jpg|jpeg|png|svg|pdf|xml|ico|JPEG|JPG|PNG|xlsx|json|csv|xls|doc|docx|XLSX|txt|gif|html|webp)$','g');
    return !patternFile.test(objectname) && !excludeIndex.includes(objectname); 
}

function checkIfImage(objectname) {
    const patternImage  = new RegExp('(jpg|jpeg|png|svg|ico|PNG|JPG|gif|JPEG|webp)$','g');
    return patternImage.test(objectname) && !excludeIndex.includes(objectname); 
}

async function getAllImages(folder, parentFolderpath) {
    try {
            const path  =   `${parentFolderpath}/${folder}`;
            const url   =   `${crxde}content${encodeURI(path)}.1.json`;
            const resp  =   await curly.get(url, options);

            const { statusCode, data } = resp
            if (statusCode != 200) {
                return null;
            } 

            const result = JSON.parse(data);
            

            if (result['jcr:primaryType'] != 'dam:Asset') {
                for(const res in result) {
                    if (checkIfFolder(res)) {
                        console.log("Folder :", res);
                        const allImages = await getAllImages(res, `${parentFolderpath}/${folder}`);
                    } 
                    if (checkIfImage(res)) {
                        console.log("Image :", res); 
                        const image = await getImageMetaDataProperty(`${parentFolderpath}/${folder}/${res}`);
                        if (isHeavy(image)) {
                            allImagesPaths.push(`${parentFolderpath}/${folder}/${res}`); 
                        }
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
        const resp = await curly.get(url, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return null;
        } 
        const result = JSON.parse(data);
        console.log(result);
        return result; 
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return null
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
        //console.log(data);
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

//getPagesWithHeavyImages('stlukeshealth'); 
//getImages();
async function runImagesScripts() {
    await getAllImages('dam', ''); 
    console.log(allImagesPaths);
    console.log(allImagesPaths.length+" images are heavy");
    return allImagesPaths; 
} 

runImagesScripts(); 


