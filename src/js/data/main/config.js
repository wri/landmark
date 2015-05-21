define('data/main/config', [], function() {
    'use strict';

    var config = {

        accordionSectionTitles: [
            'About the Data', 'Definitions', 'Data Quality', 'Data Completeness', 'National and Community Level Data'
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

        dataLevel12a: 'Land Tenure Security Indicators, as stated by law.',
        dataLevel12b: ' A series of 12 indicators (some with sub-indicators) evaluate the security of tenure rights for indigenous peoples or communities, as they are defined in national laws.. The indicators are assessed separately for each tenure type (i.e., indigenous land and community (non-indigenous) land) that is regulated and governed by a different legal framework. For example, laws governing all or certain groups of indigenous peoples’ land rights are assessed separately from laws governing the lands of other non-indigenous communities, if indeed different laws are applicable to each. Note that there can also be different laws applicable to more than one community tenure system within a country, and the references to each law and ethnic group are included in the attribute information that is available by clicking on a country in the interactive map. The indicators for each category are outlined below.',

        dataLevel13: 'Indicators of tenure security for indigenous and community lands, as stated by law:',

        dataLevel14a: 'Category',
        dataLevel14b: 'Indicator',

        dataCompletenessTable1a: 'Legal Force',
        dataCompletenessTable1b: 'Do community/indigenous land rights, including customary rights, have the same legal force as land rights based on statutory law? ',

        dataCompletenessTable2a: 'Perpetuity',
        dataCompletenessTable2b: 'Are community/indigenous land rights - customary and statutory - perpetual (i.e., not just for a fixed term)?',

        dataCompletenessTable3a: 'Government recognition',
        dataCompletenessTable3b: 'Does government recognize all community/indigenous land, including homesteads, family farms and common property (e.g., forests, pasture)?',

        dataCompletenessTable4a: 'Unregistered Land: Homesteads and farms',
        dataCompletenessTable4b: 'Does government recognize community/indigenous rights over lands held and used by individuals and families (i.e., farms and homesteads), even if not formally demarcated or registered?',

        dataCompletenessTable5a: 'Unregistered land: Forests and pastures',
        dataCompletenessTable5b: 'Does government recognize community/indigenous rights over lands held by indigenous peoples and managed as common property (i.e., forests and pastures), even if not formally demarcated or registered?',

        dataCompletenessTable6a: 'Unregistered land: Registering land',
        dataCompletenessTable6b: 'Is it allowable and are there established procedures to formally register community/indigenous land rights in a public registry?',

        dataCompletenessTable7a: 'Unregistered land: Self-governance',
        dataCompletenessTable7b: 'Are community/indigenous institutions - traditional or modern - recognized as the legal authority over community lands?',

        dataCompletenessTable8a: 'Resource Rights: Trees and forests',
        dataCompletenessTable8b: 'Are trees and forests within community/indigenous lands under community jurisdiction?',

        dataCompletenessTable9a: 'Resource Rights: Waters',
        dataCompletenessTable9b: 'Are waters - including groundwater, rivers and natural water bodies - within community/indigenous lands under community jurisdiction?',

        dataCompletenessTable10a: 'Resource Rights: Wildlife',
        dataCompletenessTable10b: 'Are wildlife (i.e., wild animals) within community/indigenous lands under community/indigenous peoples’ jurisdiction?',

        dataCompletenessTable11a: 'Resource Rights: Sub-surface minerals',
        dataCompletenessTable11b: 'Are sub-surface minerals (i.e., excluding sand, pebbles or rocks found on the surface of land) within community/indigenous lands under community/indigenous peoples’ jurisdiction?',

        dataCompletenessTable12a: 'Resource Rights: Oil and natural gas',
        dataCompletenessTable12b: 'Are oil, natural gas and other forms of hydrocarbons within community/indigenous lands under community/indigenous peoples’ jurisdiction?',

        dataCompletenessTable13a: 'Right to consent',
        dataCompletenessTable13b: 'Is community consent required before an outside actor, including government, can acquire community/indigenous land (excluding compulsory land acquisition)? ',

        dataCompletenessTable14a: 'Land acquisition',
        dataCompletenessTable14b: 'Is an outside actor, including government, required to prove that sought land is not claimed or registered as community/indigenous land?',

        dataCompletenessTable15a: 'Cadaster obligation',
        dataCompletenessTable15b: 'Must government develop an official map of all legal tenure types, including community/indigenous land?',

        dataCompletenessTable16a: 'Dispute resolution mechanism',
        dataCompletenessTable16b: 'Are dispute resolution mechanisms established for land conflicts with actors outside the community/indigenous peoples?',

        dataCompletenessTable17a: 'Equal Rights to Land: Women',
        dataCompletenessTable17b: 'Are land interests of women within the community/indigenous peoples equally protected?',

        dataCompletenessTable18a: 'Equal Rights to Land: New members',
        dataCompletenessTable18b: 'Are land interests of people joining the community/indigenous peoples by marriage, settlement or other customarily-approved means equally protected?',

        dataCompletenessTable19a: 'Equal Rights to Land: Minorities',
        dataCompletenessTable19b: 'Are land interests of minorities by virtue of ethnicity, livelihood or other distinctive attribute equally protected within the community/indigenous peoples?',


        dataLevel15: 'The following documents (in pdf format) describe the method for developing the Land Tenure Security Indicators:',

        dataLevel16: 'Indicators of Community Land Tenure Security: Guidelines for Researching, Scoring and Documenting Findings',

        dataLevel17: 'Community Level',

        dataLevel18: 'The community-level data provide sub-national information at the scale of distinct indigenous or community lands.  The status of data coverage at the community level is shown in the Data Completeness layer (see Data Completeness for additional information about this layer).',

        dataLevel19: 'The community-level data is organized and displayed according to a universal typology based on the identity and legal status of each land. This typology is used as a base reference for displaying the community-level data on the platform, allowing for comparisons of status within and across countries:',

        dataLevel20a: 'Note that a clear distinction between indigenous and non-indigenous lands can sometimes be difficult given the available information and because the community may include both indigenous peoples and non-indigenous peoples. When it is known that the majority of the population within a community is indigenous, it will be categorized as such.  In cases where it is unclear, the lands displayed on the platform default to community (non-indigenous) lands, but might be indigenous lands. Please ',

        dataLevel20b: 'contact us',

        dataLevel20c: ' if you identify indigenous lands that are currently categorized as community lands.',

        dataLevel21: 'Additional descriptive information is available for each indigenous or community land by clicking on it in the interactive map. The information displayed in the attribute box is as follows:',

        dataNamesTableHeader: 'Name given to the selected indigenous or community land',

        dataNamesTable1a: 'Country',
        dataNamesTable1b: 'In what country is the indigenous/community land located?',

        dataNamesTable2a: 'Identity',
        dataNamesTable2b: 'How does the community self-identify? (Indigenous or Non-indigenous)',
        dataNamesTable2c: ' When unclear, it is considered community lands.',

        dataNamesTable3a: 'Official recognition status',
        dataNamesTable3b: 'Is the indigenous/community territory officially recognized by law or decree? (Officially recognized or Not officially recognized)',

        dataNamesTable3c: 'What is the recognition status?',
        dataNamesTable3d: 'For lands that are officially recognized:',
        dataNamesTable3e: 'Formal document/title',
        dataNamesTable3f: 'In process of titling',
        dataNamesTable3g: 'For lands that are not officially recognized:',
        dataNamesTable3h: 'Formal land claim',
        dataNamesTable3i: 'Occupied and/or used without formal land claim',
        dataNamesTable3j: 'What is the date of the recognition status?',

        dataNamesTable4a: 'Land category',
        dataNamesTable4b: 'What is the categorical name that the local state gives to this type of indigenous/community land? (e.g., indigenous reservation, indigenous territory, customary lands, etc.)',

        dataNamesTable5a: 'Ethnic groups',
        dataNamesTable5b: 'What are the names of the ethnic groups that reside in the community?',
        dataNamesTable5a: 'May include primary, secondary, and tertiary ethnic groups based on population size.',

        dataNamesTable6a: 'Population',
        dataNamesTable6b: 'How many people reside in the community?',
        dataNamesTable6c: ' Includes the source and date of the estimation/census.',

        dataNamesTable7a: 'Land area',
        dataNamesTable7b: 'What is the area of the community land, as stated in the official documents? ',
        dataNamesTable7c: '(only applies to officially recognized lands)',
        dataNamesTable7d: ' and what is the area as calculated in GIS?',
        dataNamesTable7e: 'All areas are in hectares.',

        dataNamesTable8a: 'Acquisition scale',
        dataNamesTable8b: 'What is the scale at which the land data were collected or geo-referenced?',

        dataNamesTable9a: 'Acquisition method',
        dataNamesTable9b: 'What was the method used to acquire the community land data?',
        dataNamesTable9c: ' (e.g., hand-held GPS, transcribed from land title, hand-digitized from paper maps, etc.)',

        dataNamesTable10a: 'Data source and date',
        dataNamesTable10b: 'Which organization or individual created the data that is shown on the platform?',
        dataNamesTable10c: 'May or may not be the same as the contributing institution, and includes date that data were created or last edited',

        dataNamesTable11a: 'Data contributor',
        dataNamesTable11b: 'Which organization or individual provided the data to the platform?',

        dataNamesTable12a: 'Date uploaded',
        dataNamesTable12b: 'When were the data uploaded to the platform?',

        dataNamesTable13a: 'More info',
        dataNamesTable13b: 'Link to additional information about the data source or the community, such as bylaws, etc.',


    }



    return config;

});