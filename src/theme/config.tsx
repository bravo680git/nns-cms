import { ThemeConfig, theme } from "antd";
import { colors } from "./constants";

const themeConfig: ThemeConfig = {
    token: {
        fontSize: 14,
        fontSizeHeading1: 28,
        fontSizeHeading2: 24,
        fontSizeHeading3: 20,
        fontSizeHeading4: 16,
        fontSizeHeading5: 14,
    },
    components: {
        Layout: {
            bodyBg: colors.bg,
        },
    },
};

export { themeConfig };
