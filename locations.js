const XLSX              =   require("xlsx");
const { curly }         =   require('node-libcurl');

const COOKIE    = 'cq-authoring-mode=TOUCH; AMCV_E13D51085E59F02C0A495CDC%40AdobeOrg=-2121179033%7CMCIDTS%7C19180%7CMCMID%7C82662739415969301494412556172947609393%7CMCAAMLH-1657730806%7C9%7CMCAAMB-1657730806%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1657133206s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.3.0; __loc=TX%7CUS; fabrickId=E1%3AOh-QFJUIqpR_ZphvJz7PCmtpJ84WlV1zHq57dqvUBRCkkEwZjEag_NtuCGpH93jI04yw5YQQzktA7Vg8tO1hnHrS2oQTE4pvtfiFA5JNK0KS5tKLoV7wZ1SXte6Mt6ictxGaC8sA2Lx3vPoxLag6jw; cq-editor-layer.page=Edit; adcloud={%22_les_v%22:%22y%2Cadobecqms.net%2C1657231413%22}; utag_main=v_id:0181d4682ee0001ff0f496ad57060506f00a306700bd0$_sn:2$_ss:0$_st:1657231413780$vapi_domain:adobecqms.net$dc_visit:2$ses_id:1657229364835%3Bexp-session$_pn:4%3Bexp-session$dc_event:4%3Bexp-session$dc_region:us-east-1%3Bexp-session; oauth-configid=ims; login-token=f7a66dfd-d153-45cc-9a82-52a42baa6e2d%3a5f34583a-bcc2-435e-8ff0-c18442e3b297_17ecc320d2a0d8eb93f845d0ff5d4fb8%3acrx.default; aem-commonspirit="{2266af00c30339275a5d57c747a92e8569a54f7ec96cb25a6a404c5af1feb85ebc78684019a73becca5e158dcbe13d2bcfc3097ea88c767c6a623695bb8d0770f09ec7a5ea997ec4b4da229cebfeb5aa54dedca64839b09acf2fbadabbad3e919a89bfab7566da3d0d2a69768a101488}"; oauth-authid=ims; AMCVS_8F99160E571FC0427F000101%40AdobeOrg=1; lang=en%3Aus; s_cc=true; AMCV_8F99160E571FC0427F000101%40AdobeOrg=1687686476%7CMCIDTS%7C19185%7CMCMID%7C89156023496090199653760977611407146345%7CMCAAMLH-1658152675%7C9%7CMCAAMB-1658152675%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-613026243%7CMCOPTOUT-1657555072s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C3.0.0'
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
        domain: "https://www.stlukeshealth.org/"
    },
    {
        market: "stjoseph-stlukeshealth",
        domain: "https://stjoseph.stlukeshealth.org/"
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

async function exportLocationsData() {
    try {
        const workbook = XLSX.utils.book_new();

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

async function runAuditLocations() {
    try {
        let numberLocations = 0; 
        const drupalLocations = await getLocationsFromDrupal(); 

        for (let market of availableMarkets) {
            const locations = await getLocations(market.market); 
            for (const location in locations) {
                const locationDetails = []; 
                if (locations[location]['jcr:content']) {
                    const commonLocation = drupalLocations.filter((item) => {
                        if (item.propreties.path === `locations/${location}`) {
                            return item; 
                        }
                    });

                    if (commonLocation.length > 0) { 

                    }
                }
            }
        }


    } catch (error) {
        
    }
}


//exportLocationsData(); 
getLocationsFromDrupal();
runAuditLocations(); 