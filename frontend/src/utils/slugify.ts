export const slugify = (str: string): string =>
{
    return str
        .toLowerCase()
        .replace(/[šđčćž]/g, match =>
        {
            switch (match)
            {
                case 'š':
                    return 's';
                case 'đ':
                    return 'dj';
                case 'č':
                    return 'c';
                case 'ć':
                    return 'c';
                case 'ž':
                    return 'z';
                default:
                    return match;
            }
        })
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/ +/g, '-');
};
