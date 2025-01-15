// Базовые типы для элементов
export type Elem = {
  Variant: "primary" | "secondary";
  Size: "default" | "small" | "big";
  Style: "filled" | "outlined" | "ghosted" | "hidden";
  Target: "action" | "link";
};

// Базовый интерфейс для текстовых элементов
export interface BaseText {
  Title: string;
  Subtitle?: string;
  Description?: string;
  Caption?: string;
  CustomClass?: string;
}

// Базовый интерфейс для иконок
export interface IconProps {
  IconSprite: string;
  IconVisible: boolean;
}

// Базовый интерфейс для кнопки
export interface BaseButton {
  Visible: boolean;
  Variant?: Elem["Variant"];
  Size?: Elem["Size"];
  Style?: Elem["Style"];
  Disabled?: boolean;
  Loading?: boolean;
  Toggle?: boolean;
  Tooltip?: string;
  IconLeft?: IconProps;
  IconRight?: IconProps;
  ButtonLabel: string;
  ButtonLink?: string;
  CustomClass?: string;
  Onclick?: () => void;
  Target?: Elem["Target"];
}

// Интерфейс для карточек
export interface BaseCard extends BaseText {
  Image: string;
  Status?: string;
  FirstButton?: BaseButton;
  SecondButton?: BaseButton;
  CustomClass?: string;
}

// Интерфейс для Call to Action
export interface CallToAction extends BaseText {
  ButtonProps?: BaseButton;
}
