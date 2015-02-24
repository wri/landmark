define([], function() {
    'use strict';

    var config = {

        accordionSectionTitles: [
            'Purpose and Context', 'About the Global Map Project', 'Map Development Process', 'Steering Group Members'
        ],

        purposeText1: 'Land and natural resources lie at the heart of social, political, and economic life in much of rural Africa, Latin America, Asia, and elsewhere. For communities and indigenous peoples, they represent fundamental assets—primary sources of livelihood, nutrition, income, wealth, and employment—and are a basis for security, status, social identity, and political relations. Land and resources also have historical, cultural, and spiritual significance for these men and women.',

        purposeText2: 'A transnational mobilization of indigenous peoples over the last 4 decades has resulted in the formal recognition of their rights in various legally-binding international instruments and non-binding agreements. Rights to land and natural resources are cornerstones of these instruments. Still, while many governments in Africa, Asia, and Latin America acknowledge customary or community tenure rights to lands, few have established the strong legal protections needed to secure customary tenure over land. As a consequence, many indigenous peoples and communities throughout the world have lost access to critical natural resources, or lost their land entirely, threatening livelihoods and triggering resource-related conflicts.',

        purposeText3: 'Today, more indigenous peoples and communities are taking action to protect their lands. Some have successfully lobbied for legal change providing blanket national protection for unregistered community-based rights. Some are mapping their land as a first step to formal registration, others are submitting paperwork to obtain a land title, a growing number are filing petitions to have their concerns heard in court, and still others are taking to the streets to voice their demands.',

        purposeText4: 'New information and communication technologies are providing opportunities to address these challenges and help secure land rights. Indigenous peoples, communities and their partners around the world are using Global Positioning Systems (GPS), drones and other devices to map their land with great precision. Many have effectively used these maps to protect their land from external threats. And as more investors seek to acquire land, many communities want to share their maps with the public to let everyone know of their land claims, and proclaim, “We are here!”',

        aboutText1: 'The Global Map of Indigenous and Community Lands (Global Map) is the world’s first online, interactive platform to provide maps and other critical information on collectively-held and used lands. The Global Map is designed to help communities protect their lands. It puts the issue of land rights on the global agenda in a visible way, letting the world know of land claims and allowing indigenous peoples and communities to be proactive in asserting their rights rather than reactive to pending threats. Today, they all too often learn of threats late such as when a government official arrives and declares the land now belongs to the state or an investor arrives to begin operations. The Global Map helps build a global picture of indigenous and community lands and populations, supporting their engagement with one another and increasing their visibility to governments, corporations, and other actors.',

        aboutText2: 'The Global Map is targeted for use by governments, companies, development assistance agencies, civil society organizations as well as indigenous peoples, communities and their representatives. It supports open and accountable governments, and promotes responsible private sector investments. Governments with weak land administration systems can now see which lands are held and used by indigenous peoples and communities, helping guide land use management in ways that respect human rights and boost local livelihoods, challenging global paradigms, such as wildlife conservation and large-scale land acquisition. Public officials can also compare the situations and conditions in their countries with those in other nations, prompting actions to recognize indigenous and community land rights.',

        aboutText3: 'The Global Map can promote changes in corporate behavior and action in identifying lands for investment purposes, reducing company risks and costs by respecting local land and natural resource rights. Companies making investments can use the Global Map to avoid acquiring contested land or learn who they need to negotiate with over rights to indigenous and community land. The Global Map can also inform development assistance agency decisions and help them better target their resources and technical assistance.',

        mapDevelopment1: 'In March 2013, the Rights and Resources Initiative (RRI), Oxfam, and the International Land Coalition (ILC) convened a small group of land rights experts at the Rockefeller Foundation’s Bellagio Center in Italy to develop a common framework to scale actions in support of community land rights. The framework included four components. The Instituto del Bien Común (IBC) in Peru and World Resources Institute (WRI) were asked to lead the “information and documentation” component.',

        mapDevelopment2: 'In September 2013, IBC and WRI, together with the Aliansi Masyarakat Adat Nusantara (AMAN) from Indonesia, co-led the “Mapping & Documentation” sessions at the follow-up international conference—Scaling-Up Global Efforts to Securing Community Land and Resource Rights—convened in Interlaken, Switzerland, by RRI, ILC and Oxfam. The “Mapping & Documentation” sessions identified a number of scaling efforts, but discussions focused on the development of the Global Map.',

        mapDevelopment3: 'In February 2014, IBC, ILC and WRI convened a group of land rights organizations in Rome to discuss objectives and options for establishing the Global Map. In addition to the co-organizers, participating groups included: AMAN, Foundation for Ecological Security (FES) in India, Philippine Association for Intercultural Development (PAFID), Forest Peoples Programme (FPP), RFUK, RRI, and Liz Alden Wily, independent land tenure specialist. The group agreed to establish themselves into a Steering Group to guide the development of the Global Map.',

        mapDevelopment4: "In June 2014, WRI and IBC met in Lima, Peru, to further develop the Global Map with particular attention to developing an initial typology to present the community land maps, various technical protocols and the initial data layers. WRI and IBC were joined by Instituto Socioambiental (ISA) in Brazil and the World Atlas of Indigenous Peoples' Territories (WAIPT) in France. ISA represented Red Amazónica de Información Socioambiental Georreferenciada (RAISG), a coalition of civil society organizations from Amazon Basin countries. The WAIPT project is a collaborative effort between the Centre National de la Recherche Scientifique (CNRS), Survival International (France), and Sorbonne Nouvelle University with the support of the Ile-de-France region. WAIPT has since formally joined the Steering Group.",

        mapDevelopment5: 'Shortly after the Lima meeting and with the assistance of Blue Raster, a design firm, WRI, IBC and the Steering Group began designing and building the Global Map—collecting and preparing the information for the various data layers, developing wireframes and building out the website. In 2015, with the approval of the Steering Group, the Beta 2 platform of the Global Map was made available to the public for review and input.',

        // wriText: '<p style="font-weight: bold;">World Resources Institute (WRI)</p>' +
        //     '<p>Established: <strong>1982</strong></p>' +
        //     '<p>Headquarters: <strong>Washington DC, USA</strong></p>' +
        //     '<p>Mission: <strong>To move human society to live in ways that protect Earth’s environment and its capacity to provide for the needs and aspirations of current and future generations.</strong></p>' +
        //     '<p>Interests: <strong>TWRI’s Land and Resource Rights (LRR) project works with governments, civil society organizations, development agencies, and other actors to strengthen communities’ land, resource, and property rights as a path to poverty reduction, sustainable development, and environmental management. Operating across Latin America, Africa, and Asia, LRR’s work focuses on connections between land and equitable access to forests, food, and water.</strong></p>',
        delBienText: 'Instituto del bien Común',
        WAIPText: "World Atlas of Indigenous Peoples' Territories. Collaborative project between the Centre National de la Recherche Scientifique (CNRS), Survival International (France), and Sorbonne Nouvelle University with the support of the Ile-de-France region. ",
        WAIPTextLink: 'http://www.iheal.univ-paris3.fr/en/recherche/waipt-project',
        rightsResourcesText: 'Rights and Resource Initiative',
        forestPeoplesText: 'Forest People Program',
        internationalLandText: 'International Land Coalition',
        rainUKText: 'Rainforest Foundation UK',
        FESText: 'Foundation for Ecological Security',
        PAFIDText: 'Philippine Association for Intercultural Development, Inc.',
        aliansiText: 'Aliansi Masyarakat Adat Nusantara',
        lizAldenText: 'Liz Alden Wily -independent land tenure specialist',
        SteeringGroupsText: '<a target="_blank" href="http://www.wri.org/"><img class="aboutImageLeft" id="wriLink" src="css/images/wriLogo.png"></a>' +
            '<div id="wriDiv"><p style="font-weight: bold; font-size: 18px;">World Resources Institute (WRI)</p>' +
            '<p><strong>Established:</strong> 1982</p>' +
            '<p><strong>Headquarters: </strong>Washington DC, USA</p>' +
            '<p><strong>Mission: </strong>To move human society to live in ways that protect Earth’s environment and its capacity to provide for the needs and aspirations of current and future generations.</p>' +
            '<p><strong>Interests: </strong>WRI’s Land and Resource Rights (LRR) project works with governments, civil society organizations, development agencies, and other actors to strengthen communities’ land, resource, and property rights as a path to poverty reduction, sustainable development, and environmental management. Operating across Latin America, Africa, and Asia, LRR’s work focuses on connections between land and equitable access to forests, food, and water.</p></div>' +
            '<a target="_blank" href="http://www.ibcperu.org/"><img style="margin-top: 375px;" class="aboutImageLeft" src="css/images/bienLogo.png"></a>' +
            '<div id="ibc"><p style="font-weight: bold; font-size: 18px;">Instituto del Bien Común (IBC)</p>' +
            '<p><strong>Established: </strong>1998</p>' +
            '<p><strong>Headquarters: </strong>Lima, Peru</p>' +
            '<p><strong>Mission: </strong>To work with rural communities in Peru for the care of common goods (water bodies, forests, fisheries, protected areas and communal lands), thus contributing to the welfare of these populations and of all Peruvians.</p>' +
            '<p><strong>Interests: </strong>IBC works across landscapes of the central and northern Andean Amazon, on projects related to territorial planning, governance of the commons, preservation of the environment, sustainable development, and respect for the rights and culture of indigenous and non-indigenous and scientific and local knowledge.</p></div>' +
            '<a target="_blank" href="http://www.iheal.univ-paris3.fr/en/recherche/waipt-project"><img class="aboutImageLeft" src="css/images/waiptIcon.png"></a>' +
            '<div id="waipt"><p style="font-weight: bold; font-size: 18px;">World Atlas of Indigenous Peoples\' Territories (WAIPT)</p>' +
            '<p><strong>Established: </strong>2013</p>' +
            '<p><strong>Headquarters: </strong>Paris, France</p>' +
            '<p><strong>Mission: </strong>To create and maintain a global collaborative database of geographic information related to indigenous lands, giving higher visibility to indigenous peoples and organizations, thus encouraging greater awareness of indigenous presence and territorial issues.</p>' +
            '<p><strong>Interests: </strong>WAIPT is a collaborative project between Centre National de la Recherche Scientifique (CNRS), Survival International (France), and the Sorbonne Nouvelle University, Paris III, with the support of the Ile-de-France region. WAIPT aims to gather and analyse geographic information regarding indigenous lands and resources in order to present a global depiction of the political situation of indigenous territories and the threats they are facing.</p></div>' +
            '<a target="_blank" href="http://www.rightsandresources.org/"><img id="rightsMedia" class="aboutImageLeft" src="css/images/rightsLogo.jpg"></a>' +
            '<div id="rri"><p style="font-weight: bold; font-size: 18px;">Rights and Resource Initiative (RRI)</p>' +
            '<p><strong>Established: </strong>2006</p>' +
            '<p><strong>Headquarters: </strong>Washington DC, USA</p>' +
            '<p><strong>Mission: </strong>To support local communities’ and Indigenous Peoples’ struggles against poverty and marginalization by promoting greater global commitment and action towards policy, market and legal reforms that secure their rights to own, control and benefit from natural resources, especially land and forests.</p>' +
            '<p><strong>Interests: </strong>RRI works together with community organizations, civil society, governments, international institutions, and the private sector to promote and accelerate global efforts to improve local livelihoods, reform forest tenure and governance, combat poverty, mitigate the effects of climate change, and deliver sustainable development.</p></div>' +
            '<a target="_blank" href="http://www.forestpeoples.org/"><img style="margin-top: 300px;" class="aboutImageLeft" src="css/images/forestPeoplesLogo.gif"></a>' +
            '<div id="fpp"><p style="font-weight: bold; font-size: 18px;">Forest Peoples Program (FPP)</p>' +
            '<p><strong>Established: </strong>1990</p>' +
            '<p><strong>Headquarters: </strong>Moreton in Marsh, UK</p>' +
            '<p><strong>Mission: </strong>To support the rights of peoples who live in forests and depend on them for their livelihoods. FPP works to create political space for forest peoples to secure their rights, control their lands and decide their own futures.</p>' +
            '<p><strong>Interests: </strong>FPP advocates an alternative vision of how forests should be managed and controlled, based on respect for the rights of the peoples who know them best. FPP works with forest peoples in South America, Africa, and Asia, to help them secure their rights, build up their own organizations and negotiate with governments and companies as to how economic development and conservation are best achieved on their lands.</p></div>' +
            '<a target="_blank" href="http://www.landcoalition.org/"><img class="aboutImageLeft" src="css/images/landCOLogo.png"></a>' +
            '<div id="ilc"><p style="font-weight: bold; font-size: 18px;">International Land Coalition (ILC)</p>' +
            '<p><strong>Established: </strong>2003</p>' +
            '<p><strong>Headquarters: </strong>Rome, Italy</p>' +
            '<p><strong>Mission: </strong>ILC is a coalition of 152 organizations representing 56 countries working together to promote secure and equitable access to land for rural people, mainly through capacity building, knowledge sharing and advocacy.</p>' +
            '<p><strong>Interests: </strong>The shared vision of ILC’s members is that secure and equitable access to land, and control over land, reduce poverty and contribute to identity, dignity, and inclusion. ILC strives to overcome any practices in its operations or those of its members that perpetuate the marginalization of any section of society, and in particular of women.</p></div>' +
        // '<img class="aboutImageLeft" src="css/images/rainUKLogo.png">' +
        '<a target="_blank" href="http://www.rainforestfoundationuk.org/"><img class="aboutImageLeft" id="rainForestUKLogo"></a>' +
            '<div id="rfuk"><p style="font-weight: bold; font-size: 18px;">Rainforest Foundation UK (RFUK)</p>' +
            '<p><strong>Established: </strong>1989</p>' +
            '<p><strong>Headquarters: </strong>London, UK</p>' +
            '<p><strong>Mission: </strong>To support indigenous peoples and traditional populations of the world’s rainforest in their efforts to protect their environment and fulfil their rights to land, life, and livelihood by assisting them with: 1) Securing and controlling the natural resources necessary for their long term well-being and managing these resources in ways which do not harm their environment, violate their culture or compromise their future; 2) Developing means to protect their individual and collective rights and obtain, shape and control basic services from the state.</p>' +
            '<p><strong>Interests: </strong>RFUK promotes the establishment of community rights over rainforest lands, tackling the root of the problems related to deforestation and paving the way for local people to benefit fairly from the use and protection of forest resources.</p></div>' +
            '<a target="_blank" href="http://fes.org.in/"><img style="margin-top: 475px;" id="fesMedia" class="aboutImageLeft" src="css/images/fesLogo.gif"></a>' +
            '<div id="fes"><p style="font-weight: bold; font-size: 18px;">Foundation for Ecological Security (FES)</p>' +
            '<p><strong>Established: </strong>2001</p>' +
            '<p><strong>Headquarters: </strong>Gajurat, India</p>' +
            '<p><strong>Mission: </strong>As ‘ecological security’ is the foundation of sustainable and equitable development, FES is committed to strengthening, reviving or restoring, where necessary, the process of ecological succession and the conservation of land, forest and water resources in the country.</p>' +
            '<p><strong>Interests: </strong>FES presently works with 5,900 village institutions in 31 districts across 8 states, and assists the village communities in protecting more than 637,000 hectares of common lands including revenue wastelands, degraded forest lands and Panchayat grazing lands (Charagah lands). FES supports Panchayats and their subcommittees, Village Forest Committees, Gramya Jungle Committees, Water Users Associations and Watershed Committees in order to improve the governance of natural resources. </p></div>' +
            '<a target="_blank" href="http://www.pafid.org.ph/"><img style="margin-top: 475px;" id="pafidMedia" class="aboutImageLeft" src="css/images/pafidLogo.png"></a>' +
            '<div id="pafid"><p style="font-weight: bold; font-size: 18px;">Philippine Association for Intercultural Development, Inc. (PAFID)</p>' +
            '<p><strong>Established: </strong>1967</p>' +
            '<p><strong>Headquarters: </strong>Quezon City, Philippines</p>' +
            '<p><strong>Mission: </strong>An association of people interested in the problems of cultural minority groups.</p>' +
            '<p><strong>Interests: </strong>PAFID is engaged in the development of indigenous social organizations, management of ancestral domains, community-based natural resources management planning, community mapping, agro-forestry, technical services, policy advocacy and more.</p></div>' +

        '<a target="_blank" href="http://www.aman.or.id/"><img style="margin-top: 350px;" class="aboutImageLeft" src="css/images/amanLogo.png"></a>' +
            '<div id="aman"><p style="font-weight: bold; font-size: 18px;">Aliansi Masyarakat Adat Nusantara (AMAN)</p>' +
            '<p><strong>Established: </strong>1999</p>' +
            '<p><strong>Headquarters: </strong>Jakarta, Indonesia</p>' +
            '<p><strong>Mission: </strong>Realization of justice and prosperity in indigenous people’s lives; Political sovereignty, economic independence, and cultural dignity for indigenous peoples.</p>' +
            '<p><strong>Interests: </strong>AMAN is an independent organization of indigenous peoples on the basis of membership are indigenous communities that agree to and uphold the principles, vision, mission and goal lines struggle as contained in the decisions of the Congress of the indigenous peoples and continuously engage actively fight enforcement of customary rights and the sovereignty of indigenous peoples as a whole.</p></div>' +
            '<p style="font-weight: bold;">Liz Alden Wily</p>' +
            '<p style="font-style: italic;">independent land tenure specialist</p>'


    };

    return config;

});