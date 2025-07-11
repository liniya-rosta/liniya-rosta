import animatePlugin from "tailwindcss-animate"

const createFluidFontSize = (mobileSize, desktopSize, lineHeight) => {
    const minFontSize = `${mobileSize}px`;
    const maxFontSize = `${desktopSize}px`;

    return [
        `clamp(${minFontSize}, ${mobileSize}px + (${desktopSize} - ${mobileSize}) * ((100vw - 320px) / (1920 - 320)), ${maxFontSize})`,
        {
            lineHeight: lineHeight.toString(),
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
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/flowbite/**/*.js',
    ],
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
                "16-24-1.2": createFluidFontSize(16, 24, 1.2),
                "20-36-1.2": createFluidFontSize(20, 36, 1.2)
            },
            spacing: {
                "dynamic-48-96": createFluidSpacing(48, 96),
                "dynamic-46-64": createFluidSpacing(46, 64),
            },
            width: {
                "fluid-328-1083": createFluidWidth(328, 1083),
            },
            height: {
                "fluid-170-620": createFluidHeight(170, 620),
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
            colors: {
                border: 'var(--border)',
                ring: 'var(--ring)',
            },
        },
    },
    plugins: [animatePlugin],
}