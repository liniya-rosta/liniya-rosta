import animatePlugin from "tailwindcss-animate"

const createFluidFontSize = (mobileSize, desktopSize, lineHeight, fontWeight) => {
    const minFontSize = `${mobileSize}px`;
    const maxFontSize = `${desktopSize}px`;

    return [
        `clamp(${minFontSize}, ${mobileSize}px + (${desktopSize} - ${mobileSize}) * ((100vw - 320px) / (1920 - 320)), ${maxFontSize})`,
        {
            lineHeight: lineHeight.toString(),
            fontWeight: fontWeight,
        },
    ];
};

const createFluidSpacing = (minSize, maxSize) => {
    return `clamp(${minSize}px, ${minSize}px + (${maxSize} - ${minSize}) * ((100vw - 320px) / (1920 - 320)), ${maxSize}px)`;
};

const createFluidWidth = (minWidth, maxWidth) => {
    return `clamp(${minWidth}px, ${minWidth}px + (${maxWidth - minWidth}) * ((100vw - 320px) / (1920 - 320)), ${maxWidth}px)`;
};

const createFluidHeight = (minHeight, maxHeight) => {
    return `clamp(${minHeight}px, ${minHeight}px + (${maxHeight} - ${minHeight}) * ((100vw - 320px) / (1920 - 320)), ${maxHeight}px)`
}

export default {
    darkMode: ["class"],
    content: {
        files: [
            "./app/**/*.{js,ts,jsx,tsx,mdx}",
            "./components/**/*.{js,ts,jsx,tsx,mdx}",
            "./pages/**/*.{js,ts,jsx,tsx,mdx}",
            "./src/**/*.{js,ts,jsx,tsx,mdx}",
            "./node_modules/flowbite/**/*.js",
        ],
    },
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "16px",
                sm: "32px",
                md: "32px",
                lg: "32px",
                xl: "56px",
                fhd: "0px",
            },
        },
        extend: {
            fontSize: {
                "16-24-1.2": createFluidFontSize(16, 24, 1.2, 400),
            },
            spacing: {
                "dynamic-48-96": createFluidSpacing(48, 96),
            },
            width: {
                fluidHalf: createFluidWidth(160, 320),
            },
            height: {
                fluidSection: createFluidHeight(400, 800),
            },
            gridTemplateColumns: {
                "13": "repeat(13, minmax(0, 1fr))",
                "14": "repeat(14, minmax(0, 1fr))",
                "15": "repeat(15, minmax(0, 1fr))",
                "16": "repeat(16, minmax(0, 1fr))",
            },
            screens: {
                small: "1280px",
                mac: "1440px",
                fhd: "1920px",
            },
        },
    },
    plugins: [animatePlugin],
}