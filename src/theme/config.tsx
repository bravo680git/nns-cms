import { ThemeConfig, theme } from "antd";
import { colors } from "./constants";

const themeConfig: ThemeConfig = {
    algorithm: theme.darkAlgorithm,
    token: {
        fontSize: 14,
        fontSizeHeading1: 28,
        fontSizeHeading2: 24,
        fontSizeHeading3: 20,
        fontSizeHeading4: 16,
        fontSizeHeading5: 14,
        colorPrimary: colors.primary,
        colorBorder: colors.border,
        colorBorderBg: colors.border,
        colorBgLayout: colors.bg,
        colorBgBase: colors.bg,
        colorText: colors.txt,
        colorPrimaryBg: colors.primary,
        colorBorderSecondary: colors.border,
        colorIcon: colors.txt,
        colorTextPlaceholder: colors["second-txt"],
        colorFillContent: colors.border,
        colorSuccess: colors.success,
    },
    components: {
        Button: {
            colorIcon: colors.txt,
        },
        Menu: {
            itemSelectedColor: colors.txt,
        },
        Table: {
            borderColor: colors.border,
        },
        Skeleton: {
            colorBgBase: colors.border,
        },
    },
};

export { themeConfig };
