const XLSX              =   require("xlsx");
const { curly }         =   require('node-libcurl');

const COOKIE    = 'cq-authoring-mode=TOUCH; __loc=TX%7CUS; fabrickId=E1%3AOh-QFJUIqpR_ZphvJz7PCmtpJ84WlV1zHq57dqvUBRCkkEwZjEag_NtuCGpH93jI04yw5YQQzktA7Vg8tO1hnHrS2oQTE4pvtfiFA5JNK0KS5tKLoV7wZ1SXte6Mt6ictxGaC8sA2Lx3vPoxLag6jw; cq-editor-layer.page=Edit; AMCV_8F99160E571FC0427F000101%40AdobeOrg=1687686476%7CMCIDTS%7C19185%7CMCMID%7C89156023496090199653760977611407146345%7CMCAAMLH-1658177397%7C9%7CMCAAMB-1658177397%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-613026243%7CMCOPTOUT-1657579734s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.0.0; adcloud={%22_les_v%22:%22y%2Cadobecqms.net%2C1657574399%22}; AMCV_E13D51085E59F02C0A495CDC%40AdobeOrg=-2121179033%7CMCIDTS%7C19185%7CMCMID%7C82662739415969301494412556172947609393%7CMCAAMLH-1658177399%7C9%7CMCAAMB-1658177399%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1657579799s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; utag_main=v_id:0181d4682ee0001ff0f496ad57060506f00a306700bd0$_sn:3$_ss:1$_st:1657574400540$vapi_domain:adobecqms.net$dc_visit:3$ses_id:1657572600540%3Bexp-session$_pn:1%3Bexp-session$dc_event:1%3Bexp-session$dc_region:us-east-1%3Bexp-session; oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d%3aa5da567d-726f-436e-be91-648d292778fd_8f17274823416e5250d858b96819d5cd%3acrx.default; aem-commonspirit="{8a4dae48b51332df2e6fec8490ca6c2d4f43b0b09a878c215224339f6c955c830826945a99fb99704409e48e21d6d6f68393532867f96722661df797c386b87f998f6d3d84ab60baba7c462d4a0558c895f4ce5c1b8e76fd98627483a9ad87a30bf4d56d4011ba3349e56cf8b934e991}"; oauth-authid=ims'
const crxde     = "https://author1.stage.commonspirit.adobecqms.net/crx/server/crx.default/jcr%3aroot/content/";

const options = {
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
}; 

const availableMarkets = [
    {
        market: "stlukeshealth",
        domain: "https://www.stlukeshealth.org"
    },
    {
        market: "stjoseph-stlukeshealth",
        domain: "https://stjoseph.stlukeshealth.org"
    }
]; 

// https://author1.stage.commonspirit.adobecqms.net/crx/server/crx.default/jcr%3aroot/content/stlukeshealth/en/locations.1.json?_dc=1657555395128&node=xnode-324
async function getLocations(market) {
    try {
        const resp = await curly.get(`${crxde}${market}/en/locations.1.json`, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return null;
        } 
        return JSON.parse(data); 
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

async function getLocationPropreties(market, locationName) {
    try {
        const resp = await curly.get(`${crxde}${market}/en/locations/${locationName}/jcr%3Acontent.1.json`, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return [];
        } 
        return JSON.parse(data); 
    } catch (error) {
        console.log(error.message);
        return []
    }
}

async function getLocationAddressPropreties(market, locationName) {
    try {
        const url = `${crxde}${market}/en/locations/${locationName}/jcr:content/root/responsivegrid-body-layout/responsivegrid-content-layout/responsivegrid/responsivegrid.1.json`
        const resp = await curly.get(url, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return [];
        } 
        return JSON.parse(data); 
    } catch (error) {
        console.log(error.message);
        return []
    }
}

async function getLocationHours(market, locationName, path) {
    try {
        const url = `${crxde}${market}/en/locations/${locationName}/jcr:content/root/responsivegrid-body-layout/responsivegrid-content-layout/responsivegrid/responsivegrid/${path}/items.1.json`
        const resp = await curly.get(url, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return null;
        } 
        const hours = JSON.parse(data);
        let hour = '';
        for (let index in hours) {
            if (index.includes("item")) {
                const day = hours[index]['day']; 
                let schedule = (hours[index]['timeslots']) ? hours[index]['timeslots'] : "";
                if (hours[index]['close24Hours']) {
                    schedule = 'Closed'
                } 
                if (hours[index]['open24Hours']) {
                    schedule = 'Open 24 hours'
                }
                hour += `${day} : ${schedule} |`;
            }
        }
        return hour; 
    } catch (error) {
        console.log(error.message);
        return null; 
    }
}

async function getLocationsFromDrupal() {
    try {
        const resp = await curly.get('https://find-a-location.decodedigital.co/fal-location-json', options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return null;
        } 
        return data.features ? data.features : []; 
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

async function checkIfLocationIsPublished(market, locationPath) {
    try {
        const path  = `/content/${market}/en/locations/${locationPath}`;
        const url   = `https://author1.stage.commonspirit.adobecqms.net/crx/de/replication.jsp?path=${path}&_charset_=utf-8`
        const resp  = await curly.get(url, options);

        const { statusCode, data } = resp
        if (statusCode != 200) {
            return null;
        } 
        return data['isActivated'] && data['lastPublished'];

    } catch (error) {
        console.log(error.message);
        return null;
    }
}

async function exportLocationsData() {
    try {
        const workbook = XLSX.utils.book_new();

        const drupalLocations = await getLocationsFromDrupal();

        for (let market of availableMarkets) {
            const locations = await getLocations(market.market); 

            if(!locations) {
                throw new Error(`Unable to get locations for ${market.market}`); 
            }
            const locationSheets = [["Name", "Street", "City", "State", "Zip", "Phone", "Hours", "URL", "Path"]]; 
            for (const location in locations) {
                const locationDetails = []; 
                if (locations[location]['jcr:content']) {

                    const item          = await getLocationPropreties(market.market, location); 
                    let itemAddress     = await getLocationAddressPropreties(market.market, location); 
                    let path            = '';

                    if (itemAddress['locationaddressandho']) {
                        path = 'locationaddressandho';
                        itemAddress = itemAddress['locationaddressandho'];
                    } 
                    if (itemAddress['locationAddressAndHrs']) {
                        path = 'locationAddressAndHrs';
                        itemAddress = itemAddress['locationAddressAndHrs'];
                    } 
                    if (itemAddress['locationaddressandhr']) {
                        path = 'locationaddressandhr';
                        itemAddress = itemAddress['locationaddressandhr'];
                    }

                    locationDetails['Name']     =   (item['jcr:title']) ? item['jcr:title'] : "";
                    locationDetails['Street']   =   (itemAddress && itemAddress['street']) ? itemAddress['street'] : "";
                    locationDetails['City']     =   (itemAddress && itemAddress['city']) ? itemAddress['city'] : "";
                    locationDetails['State']    =   (itemAddress && itemAddress['state']) ? itemAddress['state'] : "";
                    locationDetails['Zip']      =   (itemAddress && itemAddress['zip']) ? itemAddress['zip'] : "";
                    locationDetails['Phone']    =   (itemAddress && itemAddress['phone']) ? itemAddress['phone'] : "";
                    locationDetails['URL']      =   `${market.domain}locations/${location}`;
                    locationDetails['Hours']    =   await getLocationHours(market.market, location, path);

                    locationSheets.push([
                        locationDetails['Name'], 
                        locationDetails['Street'], 
                        locationDetails['City'], 
                        locationDetails['State'], 
                        locationDetails['Zip'],
                        locationDetails['Phone'], 
                        locationDetails['Hours'],
                        locationDetails['URL'],
                        path
                    ]); 
                }
            }
            const worksheet = XLSX.utils.aoa_to_sheet(locationSheets); 
            XLSX.utils.book_append_sheet(workbook, worksheet, market.market);
        }
        XLSX.writeFile(workbook, "aem-locations.xlsx");
    } catch (error) {
        console.log(error.message); 
    }
}

async function getAllLocations() {
    try {
        const locationSheets    = [];
        for (let market of availableMarkets) {
            const locations = await getLocations(market.market); 

            if(!locations) {
                throw new Error(`Unable to get locations for ${market.market}`); 
            }
            
            for (const location in locations) {
                const locationDetails = {}; 
                const locationIsPublished = await checkIfLocationIsPublished(market.market, location);
                if (locations[location]['jcr:content'] && locationIsPublished) {
                    const item          = await getLocationPropreties(market.market, location); 
                    let itemAddress     = await getLocationAddressPropreties(market.market, location); 
                    let path            = '';

                    if (itemAddress['locationaddressandho']) {
                        path = 'locationaddressandho';
                        itemAddress = itemAddress['locationaddressandho'];
                    } 
                    if (itemAddress['locationAddressAndHrs']) {
                        path = 'locationAddressAndHrs';
                        itemAddress = itemAddress['locationAddressAndHrs'];
                    } 
                    if (itemAddress['locationaddressandhr']) {
                        path = 'locationaddressandhr';
                        itemAddress = itemAddress['locationaddressandhr'];
                    }

                    locationDetails['Name']     =   (item['jcr:title']) ? item['jcr:title'] : "";
                    locationDetails['Street']   =   (itemAddress && itemAddress['street']) ? itemAddress['street'] : "";
                    locationDetails['City']     =   (itemAddress && itemAddress['city']) ? itemAddress['city'] : "";
                    locationDetails['State']    =   (itemAddress && itemAddress['state']) ? itemAddress['state'] : "";
                    locationDetails['Zip']      =   (itemAddress && itemAddress['zip']) ? itemAddress['zip'] : "";
                    locationDetails['Phone']    =   (itemAddress && itemAddress['phone']) ? itemAddress['phone'] : "";
                    locationDetails['URL']      =   `/locations/${location}`;
                    locationDetails['domain']   =   market.domain;
                    locationDetails['Hours']    =   await getLocationHours(market.market, location, path);

                    locationSheets.push(locationDetails); 
                }
            }
        }

        return locationSheets;

    } catch (error) {
        console.log(error.message)
    }
}

function getLocationsInAEMNotInDrupal(drupalLocations, aemLocations) {
    try {
        const locations = [["Name", "Street", "City", "State", "Zip", "Phone", "Hours", "URL" ]]; 
        for(const aemLocation of aemLocations) {
            const locationInDrupal = drupalLocations.filter(item => aemLocation['URL'] === item['properties']['path']);
            if (locationInDrupal.length == 0) {
                locations.push([
                    aemLocation['Name'], 
                    aemLocation['Street'], 
                    aemLocation['City'], 
                    aemLocation['State'], 
                    aemLocation['Zip'],
                    aemLocation['Phone'], 
                    aemLocation['Hours'],
                    `${aemLocation['domain']}${aemLocation['URL']}`,
                ]); 
            }
        }
        console.log("Location in AEM not in Drupal :",locations.length - 1);
        return locations; 

    } catch (error) {
        console.log(error.message);
    }
}

function getLocationsInDrupalNotAEM(drupalLocations, aemLocations) {
    try {
        const locations = [["Name", "Street", "Suite", "City", "State", "Zip", "Phone", "Path" ]];
        for(const drupalLocation of drupalLocations) {
            const locationInAEM = aemLocations.filter(item => item['URL'] === drupalLocation['properties']['path']);
            if (locationInAEM.length == 0) {
                locations.push([
                    drupalLocation['properties']['name'] ? drupalLocation['properties']['name'] : "",
                    drupalLocation['properties']['street'] ? drupalLocation['properties']['street'] : "",
                    drupalLocation['properties']['suite'] ? drupalLocation['properties']['suite'] : "",
                    drupalLocation['properties']['city'] ? drupalLocation['properties']['city']: "",
                    drupalLocation['properties']['state'] ? drupalLocation['properties']['state']: "",
                    drupalLocation['properties']['zip'] ? drupalLocation['properties']['zip'] : "",
                    drupalLocation['properties']['phone'] ? drupalLocation['properties']['phone'] : "",
                    drupalLocation['properties']['path'] ? drupalLocation['properties']['path'] : ""
                ]);
            }
        }
        console.log("Location In Drupal Not AEM :",locations.length - 1);
        return locations; 

    } catch (error) {
        console.log(error.message);
    }
}

function getLocationsInCommon(drupalLocations, aemLocations) {
    try {
        const locations = [["Name", "Street", "City", "State", "Zip", "Phone", "Hours", "URL" ]]; 
        for(const aemLocation of aemLocations) {
            const locationInDrupal = drupalLocations.filter(item => aemLocation['URL'] === item['properties']['path']);
            if (locationInDrupal.length > 0) {
                locations.push([
                    aemLocation['Name'], 
                    aemLocation['Street'], 
                    aemLocation['City'], 
                    aemLocation['State'], 
                    aemLocation['Zip'],
                    aemLocation['Phone'], 
                    aemLocation['Hours'],
                    `${aemLocation['domain']}${aemLocation['URL']}`,
                ]); 
            }
        }
        console.log("Location in Common :",locations.length - 1);
        return locations; 

    } catch (error) {
        console.log(error.message);
    }
}

async function runAuditLocations() {
    try {
        const drupalLocations           = await getLocationsFromDrupal(); 
        const aemLocations              = await getAllLocations(); 
        const locationsInAEMNotDrupal   = getLocationsInAEMNotInDrupal(drupalLocations, aemLocations); 
        const locationsInDrupalNotAEM   = getLocationsInDrupalNotAEM(drupalLocations, aemLocations);
        const locationsInCommon         = getLocationsInCommon(drupalLocations, aemLocations);

        const workbook = XLSX.utils.book_new();

        const worksheetlocationsInAEMNotDrupal = XLSX.utils.aoa_to_sheet(locationsInAEMNotDrupal); 
        XLSX.utils.book_append_sheet(workbook, worksheetlocationsInAEMNotDrupal, "Locations IN AEM Not In Drupal");

        const worksheetlocationsInDrupalNotAEM = XLSX.utils.aoa_to_sheet(locationsInDrupalNotAEM); 
        XLSX.utils.book_append_sheet(workbook, worksheetlocationsInDrupalNotAEM, "Locations In Drupal Not in AEM");

        const worksheetlocationsInCommon = XLSX.utils.aoa_to_sheet(locationsInCommon); 
        XLSX.utils.book_append_sheet(workbook, worksheetlocationsInCommon, "Locations In Drupal and AEM");
        
        
        XLSX.writeFile(workbook, "aem-locations.xlsx");
    } catch (error) {
        console.log(error.message)
    }
}


//exportLocationsData(); 
//getLocationsFromDrupal();
runAuditLocations(); 

// Location in AEM not in Drupal : 105
// Location in Drupal not aem : 11 
// Location in Common : 164