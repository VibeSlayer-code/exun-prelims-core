export const servicesList = [
    {
        id: 1,
        title: "Heavy Lift Squad",
        tag: "LOGISTICS",
        price: "$120",
        image: "/assets/Services/service2.png", 
        description: "Hire a 4-person team with pulleys to move high-mass objects (AA Batteries, Coins, Scrap Metal) that are physically impossible for a single citizen to lift.",
        options: [
            { label: "Object Selection", choices: ["BATTERIES", "BOTTLE CAPS", "RAW ORE", "COINS"] },
            { label: "Mass Selection", choices: ["1 gram", "5 gram", "10 gram", "20 gram"] }
        ]
    },
    {
        id: 2,
        title: "Apex Defense",
        tag: "COMBAT",
        price: "$500",
        image: "/assets/Services/service1.png", 
        description: "Professional security escort for travel through Spider-infested zones. Includes two guards armed with needle-spears and chemical deterrents.",
        options: [
            { label: "Threat Level", choices: ["LOW", "MODERATE", "EXTREME", "SUICIDE"] },
            { label: "Squad Size", choices: ["2 GUARDS", "4 GUARDS", "PLATOON"] }
        ]
    },
    {
        id: 3,
        title: "Surface Harvesting",
        tag: "SCAVENGING",
        price: "$80.00",
        image: "/assets/Services/service3.png",
        description: "Processing giant food sources (bread crusts, fruit drops) into transportable, micro-scale rations. We break it down so you can carry it home.",
        options: [
            { label: "Target Source", choices: ["BREAD", "FRUIT", "SUGAR", "UNKNOWN"] },
            { label: "Processing Type", choices: ["CRUMBING", "LIQUEFACTION", "CUBING"] }
        ]
    },
    {
        id: 4,
        title: "Grid Siphoning",
        tag: "ENGINEERING",
        price: "$250",
        image: "/assets/Services/service4.png",
        description: "Expert electricians to safely tap into the Building's 120V main lines and step it down to safe levels for colony homes. High hazard pay included.",
        options: [
            { label: "Voltage Output", choices: ["1.5V", "3V", "9V"] },
            { label: "Stability", choices: ["STANDARD", "REINFORCED", "MIL-SPEC"] }
        ]
    },
    {
        id: 5,
        title: "Dew Collection",
        tag: "VITAL",
        price: "$45.00",
        image: "/assets/Services/service3.png", 
        description: "Harvesting condensation from cold water pipes. We deliver pure, filtered water droplets directly to your sector's reservoir.",
        options: [
            { label: "Volume", choices: ["1 DROPLET", "5 DROPLETS", "VIAL"] },
            { label: "Purity Grade", choices: ["FILTERED", "DISTILLED", "RAW"] }
        ]
    },
    {
        id: 6,
        title: "Glider Courier",
        tag: "TRANSPORT",
        price: "$60.00",
        image: "/assets/Services/service6.png", 
        description: "Need to get a message from the Ceiling Vents to the Floorboards instantly? Our gliders bypass the climbing time. Fast, risky, and reliable.",
        options: [
            { label: "Priority", choices: ["STANDARD", "RUSH", "EMERGENCY"] },
            { label: "Payload Type", choices: ["DATA SD", "PAPER NOTE", "SMALL COMPONENT"] }
        ]
    },
];