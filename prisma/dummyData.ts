
// ヘルパー: ランダムな要素を選択
const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// サンプルデータプール
const lastNames = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水'];
const firstNames = ['健太', '美咲', '翼', '未来', '拓海', '結衣', '翔太', '陽菜', '大輔', '彩花', '蓮', '莉子', '陸', '杏奈', '悠真', '真央', '湊', 'くるみ', '颯太', '芽依'];
const universities = [
    '香川大学', '徳島大学', '愛媛大学', '高知大学', '岡山大学', '広島大学', '九州大学', '大阪大学', '京都大学', '名古屋大学', '東北大学', '北海道大学', '早稲田大学', '慶應義塾大学', '明治大学', '青山学院大学', '立教大学', '中央大学', '法政大学', '日本大学', '近畿大学', '高松大学'
];
const faculties = ['経済学部', '法学部', '文学部', '工学部', '理学部', '医学部', '農学部', '教育学部', '社会学部', '経営学部', '創造工学部'];
const interestsPool = ['IT', 'マーケティング', '営業', 'エンジニア', 'デザイン', 'コンサル', '公務員', '金融', '製造', '教育', 'スポーツ', '音楽', '映画', '旅行', 'うどん', 'サウナ', 'プログラミング', '起業'];
const orientationsPool = ['挑戦', '安定', '専門', '探索', '地元就職', '成長環境'];

// 企業名生成用プール
const corpPrefix = ['日本', '香川', '四国', '瀬戸内', 'グローバル', 'ネクスト', 'デジタル', 'フロンティア', '第一', '朝日', '光', '大和', '未来', 'サンライズ', 'アーバン', 'リンク'];
const corpMid = ['工業', '銀行', 'システム', '通信', '開発', '製薬', '建設', '商事', '不動産', '食品', '運輸', 'エネルギー', 'マテリアル', 'テクノロジー', 'ライフ'];
const corpSuffix = ['株式会社', 'グループ', 'ホールディングス', 'パートナーズ', 'ソリューションズ'];
const listings = ['東証プライム', '東証スタンダード', '東証グロース', '名証メイン', '札証'];
const industries = ['IT・通信', '金融・銀行', '機械・製造', '建設・インフラ', '商社', '不動産', '医療・製薬', '小売・流通', '広告・メディア'];
const locations = ['東京都', '大阪府', '愛知県', '香川県', '福岡県', '北海道', '岡山県', '広島県'];

// --- コアユーザー (山田 健太) ---
export const dummyUsers: { [key: string]: any } = {
    'user_main': {
        id: 'user_main',
        name: '山田 健太',
        university: '香川大学',
        faculty: '経済学部',
        major: '経営学科',
        year: '3',
        title: '経済学部 3年生',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        interests: ['IT', 'マーケティング'],
        orientation: '挑戦',
        hobbies: ['プログラミング', 'サウナ', 'うどん巡り'],
        followingIds: ['s1', 's2', 's5', 'c1'],
        followerIds: ['s1', 's3', 's7', 'c1', 'c15'],
        sns: {
            instagram: 'kenta_insta_kagawa',
            x: 'kenta_tech_dev'
        },
        interactionData: {
            's1': { messageCount: 52, snsStatus: 'unlocked' },
            's2': { messageCount: 48, snsStatus: 'none' },
            's5': { messageCount: 5, snsStatus: 'none' }
        }
    }
};

// --- 5000人のユーザー生成 ---
for (let i = 1; i <= 5000; i++) {
    const id = `s${i}`;
    if (dummyUsers[id]) continue;

    const lastName = pickRandom(lastNames);
    const firstName = pickRandom(firstNames);
    const univ = pickRandom(universities);
    const faculty = pickRandom(faculties);
    const year = pickRandom(['1', '2', '3', '4']);
    
    dummyUsers[id] = {
        id,
        name: `${lastName} ${firstName}`,
        university: univ,
        faculty: faculty,
        year: year,
        title: `${faculty} ${year}年生`,
        avatar: `https://i.pravatar.cc/150?u=${id}`,
        interests: [pickRandom(interestsPool), pickRandom(interestsPool)],
        orientation: pickRandom(orientationsPool),
        hobbies: [pickRandom(interestsPool)],
        followingIds: [],
        followerIds: [],
        sns: {
            instagram: `${id}_insta`,
            x: `${id}_x`
        },
        interactionData: {}
    };
}

// --- 10000社の企業生成 ---
const generateCompanies = (count: number) => {
    const generated = [
        { 
            id: 'c1', 
            name: '株式会社タダノ', 
            industry: '機械・製造', 
            listing: '東証プライム',
            logo: 'T', 
            salary: '600万〜', 
            holidays: '125日', 
            internTitle: '建設機械開発体験', 
            internContent: '世界シェアを誇るクレーンの開発現場で、最新の工学技術を学びます。', 
            bgImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80', 
            location: '高松市',
            websiteUrl: 'https://www.tadano.co.jp/' 
        },
        { 
            id: 'c2', 
            name: '百十四銀行', 
            industry: '金融・銀行', 
            listing: '東証プライム',
            logo: '114', 
            salary: '550万〜', 
            holidays: '120日', 
            internTitle: '地域金融ビジネス体験', 
            internContent: '地方銀行の役割と、地域経済への貢献をリアルに体験するプログラムです。', 
            bgImage: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80', 
            location: '高松市',
            websiteUrl: 'https://www.114bank.co.jp/' 
        }
    ];

    const internThemes = [
        '次世代システム開発', 'グローバル・マーケティング', 'DX推進プロジェクト', '新規事業立案', 
        '営業同行・ソリューション体験', 'エンジニア・ブートキャンプ', '経営戦略シミュレーション',
        'サステナビリティ・プロジェクト', 'AI活用実務', '地域課題解決'
    ];

    for (let i = 3; i <= count + 2; i++) {
        const id = `c${i}`;
        const name = `${pickRandom(corpPrefix)}${pickRandom(corpMid)}${pickRandom(corpSuffix)}`;
        const industry = pickRandom(industries);
        const listing = pickRandom(listings);
        const salary = `${Math.floor(Math.random() * 800) + 400}万〜`;
        const internTitle = pickRandom(internThemes);
        
        generated.push({
            id,
            name,
            industry,
            listing,
            logo: name[0],
            salary,
            holidays: `${Math.floor(Math.random() * 20) + 110}日`,
            internTitle,
            internContent: `${industry}の最前線で${internTitle}を体験。実務に近い環境でスキルを磨けます。`,
            bgImage: `https://picsum.photos/seed/${id}/800/400`,
            location: pickRandom(locations),
            websiteUrl: 'https://example.com'
        });
    }
    return generated;
};

export const dummyFeaturedCompanies = generateCompanies(10000);

// --- 投稿データの生成 ---
const generatePosts = (count: number) => {
    const generated = [
        { id: 1, authorId: 's1', author: '山本 恒一', university: '香川大学', timestamp: 'たった今', content: '創造工学部の実習終わった！IT系のインターン探してます。', tags: ['#香川大', '#IT志望'], category: '学業', likes: 12, comments: 2 },
        { id: 2, authorId: 's2', author: '佐藤 未来', university: '高松大学', timestamp: '10分前', content: '今日の昼休み、うどん巡りしてきた。やっぱり「がもう」のうどんが一番好き！', tags: ['#うどん巡り', '#ランチ'], category: '日常', likes: 45, comments: 8 },
        { id: 3, authorId: 'user_main', author: '山田 健太', university: '香川大学', timestamp: '1時間前', content: '新しいマーケティングの本を読み始めました。かなり面白いです！', tags: ['#読書', '#マーケティング'], category: '日常', likes: 5, comments: 1 }
    ];

    const contentsPool = [
        'テスト勉強が全然終わらない...。誰かコツを教えて！',
        'インターンの選考通った！めっちゃ嬉しい。',
        '今日の学食のカレー、いつもより辛くない？',
        'サークル勧誘やってます！初心者大歓迎です。',
        '就活の自己分析、みんなどうやってる？',
        '地元での就職を考えてるんだけど、おすすめの企業あるかな？',
        'プログラミングの勉強始めた。Python面白い。',
        'TOEICのスコアアップのために毎日単語帳やってる。',
        '香川のうどんはやっぱり世界一だと思う。',
        '週末のイベント参加する人いるー？'
    ];

    for (let i = 10; i < count + 10; i++) {
        const user = dummyUsers[`s${Math.floor(Math.random() * 5000) + 1}`];
        if (!user) continue;

        generated.push({
            id: i,
            authorId: user.id,
            author: user.name,
            university: user.university,
            timestamp: `${Math.floor(Math.random() * 23) + 1}時間前`,
            content: pickRandom(contentsPool),
            tags: [`#${user.university}`, `#${user.orientation}`],
            category: pickRandom(['日常', '学業', 'イベント', '就活']),
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20)
        });
    }
    return generated;
};

export const initialPosts = generatePosts(1200);

export const initialConversations = [
    { id: 201, userId: 's2', name: '佐藤 未来', lastMessage: 'よろしくお願いします！', timestamp: '1時間前', unread: true },
    { id: 202, userId: 's1', name: '山本 恒一', lastMessage: '明日の講義、代返頼める？', timestamp: '3時間前', unread: false },
];

export const initialCompanyConversations = [];
export const initialChatHistories = {
    201: [
        { id: 1, sender: 'them', text: 'こんにちは！', timestamp: '10:00' },
        { id: 2, sender: 'me', text: 'よろしくお願いします！', timestamp: '10:05' },
    ],
    202: [
        { id: 1, sender: 'them', text: 'お疲れ！', timestamp: '09:00' }
    ]
};

export const dummyCollectedCards = [
    { id: 's1', name: '山本 恒一', university: '香川大学', title: '創造工学部 3年' },
    { id: 's2', name: '佐藤 未来', university: '高松大学', title: '経営学部 3年' }
];

export const dummyCircles = [
    { 
        id: 'circ1', 
        name: 'プログラミングサークル', 
        category: 'IT/技術', 
        members: 25, 
        description: '香川大学の学生を中心としたIT技術探求サークルです。アプリ開発から競技プログラミングまで幅広く活動しています。',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'
    },
    { 
        id: 'circ2', 
        name: 'うどん部', 
        category: '文化/芸術', 
        members: 50, 
        description: '美味しい店を求めて香川県内を駆け巡ります。定期的な食べ歩きツアーを開催中。',
        image: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0c51?auto=format&fit=crop&w=400&q=80'
    }
];
