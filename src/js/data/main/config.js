define([], function() {
    'use strict';

    var config = {

        accordionSectionTitles: [
            'Data', 'Definitions', 'Data Quality', 'Data Completeness', 'National and Community Level Data'
        ],


        dataText: 'LandMark: The Global Platform of Indigenous and Community Lands',
        dataText2: ' aims to display the best-quality data available on indigenous and community lands worldwide.  At the community level, it provides a common platform for hosting datasets of individuals and organizations around the world that are devoted to mapping and documenting land rights. At the national level, it provides information on the coverage and tenure security of community lands based on research and literature reviews. ',
        dataText3: 'LandMark',
        dataText4: ' consolidates the numerous ongoing efforts to map and document indigenous and community lands worldwide within a single collaborative geographic platform, fostering greater visibility of their global situation.',


        definitionText1a: 'The following definitions apply for the purposes of categorizing, symbolizing and displaying data on the ',
        definitionText1b: ':',

        definitionText2a: 'Communities',
        definitionText2b: ' are a grouping of individuals and families who share common interests and are often united by tradition or custom. These rural social groups hold some or all their lands and natural resources on a collective basis. Communities have long-standing and distinctive cultural, traditional, and historical connections to the land. The norms (e.g., rules and institutions) by which communities hold and govern these lands and resources are usually founded in custom.',

        definitionText3a: 'Community lands',
        definitionText3b: ' refer to the collectively-held or governed lands—and the attached natural resources—that are used by communities. In many communities, some community land is allocated for individuals and families to use for homesteads and farms, but which remains under the ambit of community control. Other community land is collectively-held, managed and used as common property (also referred to as “commons”, “commonage” or “communal lands”).',

        definitionText4a: 'Indigenous Peoples',
        definitionText4b: ' are individuals, families and communities who self-identify as indigenous and are recognized as such by other members of their community. It is important to distinguish indigenous peoples from communities (the former being a subset of the latter) because indigenous peoples are specifically recognized in international human rights instruments, which include collective rights to land and natural resources.',

        definitionText5a: 'Indigenous lands',
        definitionText5b: ' refer to the collectively-held and governed lands and the associated natural resources used by indigenous peoples. As with community lands, some indigenous lands may be allocated for individuals and families to use while other indigenous land is managed as common property and used by all members.',

        definitionText6a: 'Land tenure',
        definitionText6b: ' is the legal or customarily-defined relationship among people—as individuals or groups—with respect to land.',

        definitionText7a: 'Land tenure security',
        definitionText7b: ' is the certainty that an individual’s or community’s rights to land will be recognized by others and protected in cases of specific challenges. The attributes and sources of tenure security may vary from context to context. To a large extent, it is what people and communities perceive it to be.',



        dataQuality1: 'The data and information displayed on ',
        dataQuality1b: ' are assembled from many different sources and contributors. In order to ensure the quality of information, the data displayed on ',
        dataQuality1c: ' are all issued from vetted sources and all information is fully traceable with the various sources explicitly displayed in the attribute information associated with each data layer for both national and community level datasets ',
        dataQuality1d: '(see National and Community Level Data).',


        dataQuality2: 'Geographic boundaries for the national level data are sourced from the ',
        dataQuality2b: 'GADM Database of Global Administrative Areas.',
        dataQuality2c: ' Both national and community level data is post-processed to conform to a universal standard to the extent possible, which includes a common typology and projection (WGS1984 Web Mercator Auxiliary Sphere).',

        dataQuality3: 'The following measures are in place to ensure as high quality and accurate data as possible to be presented on the platform:',

        dataQuality4a: 'Contributors.',
        dataQuality4b: ' Only data from vetted individuals and organizations that are well-recognized in the land rights community are displayed on the platform. The name of each contributing individual/organization is available in the attribute information, accessible by clicking on a geographic feature in the interactive map. These parties are directly responsible for the accuracy and quality of the data they provide. Users may contact the data contributor directly or ',
        dataQuality4c: 'contact',
        dataQuality4d: ' the administrators of LandMark to convey comments or questions about the data displayed.',

        dataQuality5a: 'Method and scale.',
        dataQuality5b: ' The attribute information for each data feature of community lands includes the method of data collection (e.g., hand-held GPS, transcribed from land title, hand-digitized from paper maps, etc.) and the scale at which data were mapped (when available). This information provides insight into the accuracy and quality of boundary information.',

        dataQuality6a: 'Frequency of updates.',
        dataQuality6b: ' Data layers are updated as new features are uploaded by contributors or the platform administrators. The date that boundaries or attribute information were last edited by the source or contributing individual/organization, as well as the date the data were uploaded to the platform, are available in the attributes. ',

        dataQuality7a: 'Comprehensiveness of data.',
        dataQuality7b: ' The data completeness layer provides for each country a rough estimate of the comprehensiveness of the community-level data displayed on the map as compared to the estimated total area of land actually held or used by communities in that country. The layer is meant to show that even though community-level data are present, they may not be fully representative of all community lands in that country; or, if no community-level data is present, indigenous peoples and communities may still hold or use land in that country. See ',
        dataQuality7c: 'Data Completeness section.',


        dataQuality8a: 'While ',

        dataQuality8b: ' administrators and the Steering Group members guiding the platform have implemented the above quality-control measures, the community lands boundaries are not verified on the ground by ',
        dataQuality8c: ' The data contributors are fully responsible for the accuracy of their data and any errors are the responsibility of the contributors to correct, though ',

        dataQuality8d: ' can serve as an intermediary in informing contributors of inaccuracies.',

        dataQuality9: 'The maps displayed on the platform should be treated as a first--and not a singular or final--step in assessing the locations of lands held or used by indigenous peoples and communities. Many communities have not yet mapped their land, and data are continuously being added to or updated on the platform. On-the-ground research and verification is necessary for proper due diligence for any actions that may affect indigenous peoples and communities.',

        dataCompleteness1: ' is a work in progress. Global coverage of indigenous and community land boundary data is the long-term goal, but it is far from being achieved. Data for some countries are completely missing, while for other countries data are incomplete. The Data Completeness layer seeks to address the issue of missing community-level data by showing which countries have a “complete or nearly complete dataset”; “partially complete dataset”; or “no or very few data.”  This dataset shows, for example, that even though a country may not have community-level data displayed on the map, indigenous peoples and communities may still hold or use land in that country.',

        dataCompleteness2a: 'The data completeness layer is based on a comparison between the estimation of the total percentage of land held and used by indigenous peoples and communities at the national level and the total amount of data displayed on ',
        dataCompleteness2b: ' at the community level for a particular country (',
        dataCompleteness2c: 'See National and Community Level Data',
        dataCompleteness2d: '). The categories of data completeness are defined at the country level as follows:',

        dataCompleteness3a: 'Category of data completeness',
        dataCompleteness3b: 'Description',

        dataCompleteness4a: 'Complete or nearly complete dataset',
        dataCompleteness4b: 'Data on the locations of indigenous and community lands is displayed on the map, and the available data covers all or most (>75%, approximately) of the total area estimated for the country.',

        dataCompleteness5a: 'Partially complete dataset',
        dataCompleteness5b: 'Data on the locations of indigenous and community lands is displayed on the map, but the available data covers only a portion (approximately 25-75%) of the total area estimated for the country.',

        dataCompleteness6a: 'No or very few data',
        dataCompleteness6b: 'It is known that indigenous peoples or communities hold or use land in this country, but data on the locations of these lands are not available or are very sparse (<25% coverage, approximately).',


        dataCompleteness7a: 'Not evaluated',
        dataCompleteness7b: 'It is unknown if indigenous peoples or communities hold or use land in this country or the country has not been evaluated.',

        dataCompleteness8: 'The data completeness layer is “on” by default when viewing the community level data so that the user is aware that a lack of data on the platform does not necessarily mean the absence of indigenous or community lands in that country. The layer’s transparency can be adjusted or the layer itself turned off in the top section of the interactive map.',

        dataCompleteness9a: ' is continuously seeking new data to fill in the gaps in data coverage, if you or your organization can help, please ',
        dataCompleteness9b: 'contact us.',


        dataLevel1: 'The data displayed on this global platform is organized into two levels: national level and community level.',

        dataLevel2: 'National Level',

        dataLevel3: 'The national-level data provide information at the scale of the entire country. The national-level data currently includes two datasets:',

        dataLevel4: 'Percent of Country Area Held or Used by Indigenous Peoples and/or Communities:',

        dataLevel5: 'This layer represents the estimated area of land held or used by indigenous peoples and/or non-indigenous communities per country. It is calculated by dividing the total land area of the country by an estimate of the percentage of the land held or used by them. These estimates are based on literature reviews and/or computed from the total amount of customary land that is not privately owned or under a land use incompatible with the existence of indigenous and/or community lands. The results and sources of the estimate can be consulted in the attribute box that appears by clicking on a country in the interactive map. This information is divided into three categories that can be displayed on the map according to the users selection: ',

        dataLevel6a: 'Indigenous peoples and communities:',
        dataLevel6b: ' Estimate of the total land held or used by indigenous peoples and non-indigenous communities, as a percentage of the total land area of the country.',

        dataLevel7a: 'Indigenous peoples only:',
        dataLevel7b: ' Estimate of land held or used by indigenous peoples only (excluding non-indigenous communities), as a percentage of the total land area of the country.',

        dataLevel8a: 'Indigenous peoples and communities:',
        dataLevel8b: ' Estimate of land held or used by non-indigenous communities only (excluding indigenous lands), as a percentage of the total land area of the country.',

        dataLevel9: 'Methods for calculating developing the “Percent of Country Area Held or Used by Indigenous Peoples and/or Communities” datasets may vary for different countries or regions of the world. The following documents (in pdf format) provide information on the methods for calculating these areas, organized by region:',

        dataLevel10: 'Africa',
        dataLevel11: 'Americas and Oceania',

    }



    return config;

});