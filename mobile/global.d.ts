import 'react-native';
import 'expo-image';
import 'heroui-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface TextInputProps {
    className?: string;
  }

  interface PressableProps {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }
}

declare module 'expo-image' {
  interface ImageProps {
    className?: string;
  }
}

declare module '*.css';

declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useMemo: any;
}
