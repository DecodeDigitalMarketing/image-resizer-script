const { curly }            =   require('node-libcurl');
const XLSX                 =   require("xlsx");
const { crxde, options }   =   require("./config/env-config");

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

const allImagesPaths = new Set();
allImagesPaths.add(["Image Name", "Image Path", "Page Path", "URL"]); 

const availableMarkets = {
    'stlukeshealth' : 'https://www.stlukeshealth.org/',
    'stjoseph-stlukeshealth': 'https://stjoseph.stlukeshealth.org/'
}

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
                            await extractPages(`${parentFolderpath}/${folder}/${res}`, res); 
                        }
                    }
                }
            } 
            
        } catch (error) {
            console.log(error.message);
            return null;
    }
}

async function extractPages(path, imageName) {
    const fullPath = `${path}`;
    const searchResult = await search(imageName); 
    if (!searchResult.results.length) {
        return [];
    }
    
    const filterFunction = function(item) {
        if (item.path && !item.path.includes('/dam') && !item.path.includes('/nonprod-test')) {
            return true; 
        }
        return false;
    }

    searchResult.results.forEach((item) => {
        if (filterFunction(item)) {
            let domain = ''
            let url = item.path.split('/jcr:content')[0];
            if (item.path.includes('/stlukeshealth/')) {
                domain = availableMarkets['stlukeshealth']; 
                url = `${domain}${url.replace('/content/stlukeshealth/en/', '')}`;
                allImagesPaths.add([imageName, fullPath, item.path, url]);
            } 
            if (item.path.includes('/stjoseph-stlukeshealth/')) {
                domain = availableMarkets['stjoseph-stlukeshealth'];
                url = `${domain}${url.replace('/content/stjoseph-stlukeshealth/en/', '')}`;
                allImagesPaths.add([imageName, fullPath, item.path, url]);
            }
        }
    });
}

async function getImageMetaDataProperty(path) {
    try {
        const url = `${crxde}content${encodeURI(path)}/jcr%3Acontent/metadata.1.json`;
        console.log("Getting Image Metadata function URL Request :", url);
        const resp = await curly.get(url, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return [];
        } 
        const result = JSON.parse(data);
        return result; 
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return null
    }
}

async function search(imageName) {
    try {
        const searchUrl     =   'https://author1.stage.commonspirit.adobecqms.net/crx/de/search.jsp'
        const urlRequest    =   `${searchUrl}?_dc=1656531436482&query=${encodeURI(imageName)}&start=1&limit=100&_charset_=utf-8`
        const resp          =   await curly.get(urlRequest, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return [];
        } 
        return data; 
    } catch (e) {
        console.log(e);
        console.log(e.message);
        return {}; 
    }
}

async function runImagesScripts() {
    await getAllImages('dam', ''); 
    const worksheet = XLSX.utils.aoa_to_sheet(Array.from(allImagesPaths)); 
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Images");
    XLSX.writeFile(workbook, "image-audit.xlsx");
} 

module.exports = {
    runImagesScripts
}


