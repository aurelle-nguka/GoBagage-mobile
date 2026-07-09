module.exports = function (api){
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root:['./'],
                    alias:{
                        '@':'./',
                        '@/features': './features',
                        '@/store': './store',
                        '@/theme': './store',
                        '@/types': './types',
                        '@/assets': './assets',
                    }
                }
            ],
            'react-native-reanimated/plugin'
        ]
    }
}