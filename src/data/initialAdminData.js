// Initial store seed data for Orders, Coupons, Customer Inquiries, and Site Settings

export const INITIAL_COUPONS = [
    {
        code: "LEAF15",
        discountPercent: 15,
        type: "percentage",
        minSpend: 0,
        usageCount: 64,
        isActive: true,
        description: "15% off entire order for spring release"
    },
    {
        code: "WELCOME10",
        discountPercent: 10,
        type: "percentage",
        minSpend: 0,
        usageCount: 112,
        isActive: true,
        description: "Welcome gift for new plant parents"
    },
    {
        code: "BONSAI20",
        discountPercent: 20,
        type: "percentage",
        minSpend: 4000,
        usageCount: 29,
        isActive: true,
        description: "20% off on premium bonsai orders above Rs. 4,000"
    },
    {
        code: "GREEN250",
        discountPercent: 250,
        type: "fixed",
        minSpend: 2500,
        usageCount: 18,
        isActive: true,
        description: "Rs. 250 flat discount on orders over Rs. 2,500"
    }
];

export const INITIAL_ORDERS = [
    {
        id: "LC-9821",
        date: "2026-10-14T08:45:00.000Z",
        customer: {
            firstName: "Dilshan",
            lastName: "Perera",
            email: "dilshan.perera@example.com",
            phone: "+94 77 123 4567",
            address: "45/2 Lotus Grove, Havelock Road",
            city: "Colombo 05",
            postalCode: "00500",
            notes: "Please call upon arrival at the gate."
        },
        items: [
            {
                id: "mini-bonsai-tree",
                name: "Japanese Juniper Bonsai",
                category: "Bonsai",
                price: 2500,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80"
            },
            {
                id: "golden-barrel-cactus",
                name: "Golden Barrel Cactus",
                category: "Cactus",
                price: 950,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?auto=format&fit=crop&w=900&q=80"
            }
        ],
        subtotal: 4400,
        discountAmount: 660,
        couponCode: "LEAF15",
        shippingMethod: "standard",
        shippingFee: 0,
        total: 3740,
        paymentMethod: "card",
        status: "Processing",
        trackingNumber: "SLP-94821",
        adminNotes: "Fragile bonsai packaging verified by master nursery team."
    },
    {
        id: "LC-9818",
        date: "2026-10-13T16:15:00.000Z",
        customer: {
            firstName: "Anushka",
            lastName: "Silva",
            email: "anushka.silva@example.com",
            phone: "+94 71 892 3411",
            address: "128 Kandy Road, Kiribathgoda",
            city: "Gampaha",
            postalCode: "11600",
            notes: "Leave with security if not answering."
        },
        items: [
            {
                id: "chinese-elm-bonsai",
                name: "Chinese Elm Bonsai",
                category: "Bonsai",
                price: 3400,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80"
            }
        ],
        subtotal: 3400,
        discountAmount: 340,
        couponCode: "WELCOME10",
        shippingMethod: "express",
        shippingFee: 650,
        total: 3710,
        paymentMethod: "card",
        status: "Shipped",
        trackingNumber: "EXP-11029",
        adminNotes: "Dispatched via City Express courier."
    },
    {
        id: "LC-9805",
        date: "2026-10-12T11:20:00.000Z",
        customer: {
            firstName: "Kasun",
            lastName: "Jayawardena",
            email: "kasun.j@example.com",
            phone: "+94 76 543 2190",
            address: "74 Sea Street, Mount Lavinia",
            city: "Colombo",
            postalCode: "10370",
            notes: "Morning delivery preferred."
        },
        items: [
            {
                id: "raw-terracotta-planter",
                name: "Hand-Thrown Terracotta Pot",
                category: "Flower Pots",
                price: 1350,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80"
            }
        ],
        subtotal: 2700,
        discountAmount: 0,
        couponCode: "",
        shippingMethod: "standard",
        shippingFee: 350,
        total: 3050,
        paymentMethod: "cod",
        status: "Delivered",
        trackingNumber: "SLP-88204",
        adminNotes: "Delivered and paid in cash. Customer confirmed receipt."
    },
    {
        id: "LC-9799",
        date: "2026-10-11T14:05:00.000Z",
        customer: {
            firstName: "Nirosha",
            lastName: "Fernando",
            email: "nirosha.f@example.com",
            phone: "+94 70 334 9912",
            address: "18 Temple Lane, Kollupitiya",
            city: "Colombo 03",
            postalCode: "00300",
            notes: "Gift note requested: Happy Birthday Amma!"
        },
        items: [
            {
                id: "rosette-echeveria",
                name: "Rosette Echeveria Succulent",
                category: "Succulents",
                price: 750,
                quantity: 3,
                image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80"
            }
        ],
        subtotal: 2250,
        discountAmount: 0,
        couponCode: "",
        shippingMethod: "standard",
        shippingFee: 350,
        total: 2600,
        paymentMethod: "bank",
        status: "Pending",
        trackingNumber: "",
        adminNotes: "Bank transfer slip awaiting verification."
    }
];

export const INITIAL_MESSAGES = [
    {
        id: "msg-101",
        date: "2026-10-14T07:15:00.000Z",
        name: "Pradeep Samarasinghe",
        email: "pradeep.s@gmail.com",
        subject: "care",
        message: "Hello team! I purchased a Japanese Juniper bonsai last month. A few needles on the lower branch are turning slightly bronze. Is this normal seasonal shedding or does it need more humidity?",
        status: "unread",
        replyNote: ""
    },
    {
        id: "msg-102",
        date: "2026-10-13T19:30:00.000Z",
        name: "Minoli Ratnayake",
        email: "minoli.design@workspace.lk",
        subject: "corporate",
        message: "Hi, we are redecorating our creative tech office in Colombo 04 and want to order 25 desktop succulent sets with custom branded ceramic pots for our staff. Do you offer corporate pricing?",
        status: "read",
        replyNote: "Forwarded corporate catalog PDF via email."
    },
    {
        id: "msg-103",
        date: "2026-10-12T15:10:00.000Z",
        name: "Kavinda Wickramasinghe",
        email: "kavinda.w@yahoo.com",
        subject: "order",
        message: "Can I pick up my terracotta pot directly from your Colombo 07 studio instead of courier delivery?",
        status: "replied",
        replyNote: "Confirmed studio pick-up availability between 9am-6pm."
    }
];

export const INITIAL_SITE_SETTINGS = {
    storeName: "Leaf & Clay",
    tagline: "Plants & Decorative Pots",
    announcementText: "Spring Garden Sale: Use code LEAF15 for 15% off your entire order!",
    announcementActive: true,
    announcementCoupon: "LEAF15",
    freeShippingThreshold: 3500,
    standardShippingFee: 350,
    storePhone: "+94 (11) 234-5678",
    storeEmail: "hello@leafandclay.lk",
    storeAddress: "No. 42 Botanical Gardens Road, Colombo 07",
    storeHours: "Mon - Sun: 8:30 AM - 7:30 PM",
    heroTitle: "Living Art for Mindful Spaces.",
    heroSubtitle: "Hand-trained Japanese bonsai, resilient architectural cacti, and hand-thrown ceramic pots—cultivated with botanical expertise to purify your home and workspace.",
    heroBadge: "Spring Nursery Release • 2026 Collection"
};
