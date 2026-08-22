import { ChineseWord, HSKSystem } from '../types';

export const LEVEL_DESCRIPTIONS: Record<HSKSystem, Record<string, { title: string; desc: string; countDesc: string }>> = {
  traditional: {
    '1': {
      title: 'ระดับ 1 (ขั้นต้น 1)',
      desc: 'คำศัพท์และประโยคพื้นฐานที่สุด เข้าใจประโยคง่ายๆ ในชีวิตประจำวันได้',
      countDesc: 'สะสมประมาณ 150 คำ'
    },
    '2': {
      title: 'ระดับ 2 (ขั้นต้น 2)',
      desc: 'สื่อสารเรื่องง่ายๆ และเรื่องที่คุ้นเคยในชีวิตประจำวันอย่างตรงไปตรงมา',
      countDesc: 'สะสมประมาณ 300 คำ'
    },
    '3': {
      title: 'ระดับ 3 (ขั้นกลาง 1)',
      desc: 'พูดคุย สื่อสารทั่วไปในชีวิตประจำวัน การเรียน และการทำงานได้',
      countDesc: 'สะสมประมาณ 600 คำ'
    },
    '4': {
      title: 'ระดับ 4 (ขั้นกลาง 2)',
      desc: 'สนทนาหัวข้อกว้างขึ้น อภิปรายปัญหาต่างๆ และอธิบายสิ่งต่างๆ ได้เป็นอย่างดี',
      countDesc: 'สะสมประมาณ 1,200 คำ'
    },
    '5': {
      title: 'ระดับ 5 (ขั้นสูง 1)',
      desc: 'อ่านหนังสือพิมพ์ นิตยสารจีน และเข้าใจข่าวหรือดูซีรีส์จีนรู้เรื่องเป็นส่วนใหญ่',
      countDesc: 'สะสมประมาณ 2,500 คำ'
    },
    '6': {
      title: 'ระดับ 6 (ขั้นสูง 2)',
      desc: 'เข้าใจข้อมูลที่ฟังหรืออ่านได้อย่างง่ายดาย สื่อสารและแสดงความเห็นได้อย่างคล่องแคล่ว',
      countDesc: 'สะสมมากกว่า 5,000 คำ'
    }
  },
  new: {
    '1': {
      title: 'ระดับ 1 (ขั้นต้น)',
      desc: 'ปูพื้นฐานการออกเสียง ตัวอักษรเดี่ยว และบทสนทนาทักทายทั่วไป',
      countDesc: 'เน้นพินอิน ตัวอักษรพื้นฐาน 300 คำ'
    },
    '2': {
      title: 'ระดับ 2 (ขั้นต้น)',
      desc: 'แลกเปลี่ยนข้อมูลส่วนตัวเบื้องหลังง่ายๆ เช่น แนะนำตนเอง ครอบครัว ช้อปปิ้ง',
      countDesc: 'สะสมประมาณ 600 คำ'
    },
    '3': {
      title: 'ระดับ 3 (ขั้นต้น)',
      desc: 'สามารถเดินทาง ท่องเที่ยว และแก้ปัญหาเฉพาะหน้าที่จำเป็นในชีวิตประจำวันได้',
      countDesc: 'สะสมประมาณ 900 คำ'
    },
    '4': {
      title: 'ระดับ 4 (ขั้นกลาง)',
      desc: 'เข้าใจประเด็นสำคัญของบทสนทนาการทำงาน งานอดิเรก และการเรียนทั่วไป',
      countDesc: 'สะสมประมาณ 1,200 - 2,000 คำ'
    },
    '5': {
      title: 'ระดับ 5 (ขั้นกลาง)',
      desc: 'สื่อสารโต้ตอบเชิงลึก อธิบายเหตุการณ์ และแลกเปลี่ยนความเห็นเชิงสังคมระดับกลาง',
      countDesc: 'สะสมประมาณ 3,000 คำ'
    },
    '6': {
      title: 'ระดับ 6 (ขั้นกลาง)',
      desc: 'สามารถอ่านบทความเชิงสารคดีสั้นๆ ทำรายงานสรุป และเขียนบันทึกประจำวันได้ดี',
      countDesc: 'สะสมประมาณ 4,000 - 5,000 คำ'
    },
    '7': {
      title: 'ระดับ 7 (ขั้นสูง)',
      desc: 'ขั้นเริ่มต้นสำหรับการทำงานเชิงลึก การแปล อภิปรายหัวข้อซับซ้อนเชิงสังคม',
      countDesc: 'สะสมมากกว่า 5,000 คำ'
    },
    '8': {
      title: 'ระดับ 8 (ขั้นสูง)',
      desc: 'เข้าใจเอกสารทางการและบทวรรณกรรมส่วนใหญ่ แปลความหมายแบบเรียลไทม์ได้ดี',
      countDesc: 'สะสมความรู้ขั้นก้าวหน้า'
    },
    '9': {
      title: 'ระดับ 9 (ขั้นสูง/ล่าม)',
      desc: 'สำหรับผู้เชี่ยวชาญ คล่องแคล่วเทียบเท่าเจ้าของภาษา เข้าใจภาษาโบราณและศัพท์เฉพาะทางลึกซึ้ง',
      countDesc: 'ขั้นล่ามและนักวิชาการระดับมืออาชีพ'
    }
  }
};

export const PREBUILT_VOCABULARY: Record<HSKSystem, Record<string, ChineseWord[]>> = {
  traditional: {
    '1': [
      {
        id: 'trad_1_1',
        character: '我',
        pinyin: 'wǒ',
        thaiMeaning: 'ฉัน, ผม',
        englishMeaning: 'I, me',
        pos: 'pronoun',
        exampleSentence: '我学习汉语。',
        examplePinyin: 'Wǒ xuéxí Hànyǔ.',
        exampleThai: 'ฉันเรียนภาษาจีน',
        exampleEnglish: 'I study Chinese.'
      },
      {
        id: 'trad_1_2',
        character: '你',
        pinyin: 'nǐ',
        thaiMeaning: 'คุณ, เธอ',
        englishMeaning: 'you',
        pos: 'pronoun',
        exampleSentence: '你身体好吗？',
        examplePinyin: 'Nǐ shēntǐ hǎo ma?',
        exampleThai: 'เธอสบายดีไหม?',
        exampleEnglish: 'Are you in good health?'
      },
      {
        id: 'trad_1_3',
        character: '好',
        pinyin: 'hǎo',
        thaiMeaning: 'ดี',
        englishMeaning: 'good, well',
        pos: 'adjective',
        exampleSentence: '今天天气很好。',
        examplePinyin: 'Jīntiān tiānqì hěn hǎo.',
        exampleThai: 'วันนี้อากาศดีมาก',
        exampleEnglish: 'Today\'s weather is very good.'
      },
      {
        id: 'trad_1_4',
        character: '谢谢',
        pinyin: 'xièxie',
        thaiMeaning: 'ขอบคุณ',
        englishMeaning: 'thank you',
        pos: 'verb',
        exampleSentence: '谢谢你帮我。',
        examplePinyin: 'Xièxie nǐ bāng wǒ.',
        exampleThai: 'ขอบคุณที่คุณช่วยฉัน',
        exampleEnglish: 'Thank you for helping me.'
      },
      {
        id: 'trad_1_5',
        character: '家',
        pinyin: 'jiā',
        thaiMeaning: 'บ้าน, ครอบครัว',
        englishMeaning: 'home, family',
        pos: 'noun',
        exampleSentence: '我爱我的家。',
        examplePinyin: 'Wǒ ài wǒ de jiā.',
        exampleThai: 'ฉันรักบ้านของฉัน',
        exampleEnglish: 'I love my family.'
      },
      {
        id: 'trad_1_6',
        character: '苹果',
        pinyin: 'píngguǒ',
        thaiMeaning: 'แอปเปิ้ล',
        englishMeaning: 'apple',
        pos: 'noun',
        exampleSentence: '我每天吃一个苹果。',
        examplePinyin: 'Wǒ měitiān chī yí gè píngguǒ.',
        exampleThai: 'ฉันกินแอปเปิ้ลหนึ่งผลทุกวัน',
        exampleEnglish: 'I eat an apple every day.'
      },
      {
        id: 'trad_1_7',
        character: '喝',
        pinyin: 'hē',
        thaiMeaning: 'ดื่ม',
        englishMeaning: 'to drink',
        pos: 'verb',
        exampleSentence: '我想喝一杯水。',
        examplePinyin: 'Wǒ xiǎng hē yì bēi shuǐ.',
        exampleThai: 'ฉันอยากดื่มน้ำสักแก้ว',
        exampleEnglish: 'I want to drink a glass of water.'
      },
      {
        id: 'trad_1_8',
        character: '水',
        pinyin: 'shuǐ',
        thaiMeaning: 'น้ำ',
        englishMeaning: 'water',
        pos: 'noun',
        exampleSentence: '水是生命的源泉。',
        examplePinyin: 'Shuǐ shì shēngmìng de yuánquán.',
        exampleThai: 'น้ำคือแหล่งกำเนิดของชีวิต',
        exampleEnglish: 'Water is the source of life.'
      },
      {
        id: 'trad_1_9',
        character: '猫',
        pinyin: 'māo',
        thaiMeaning: 'แมว',
        englishMeaning: 'cat',
        pos: 'noun',
        exampleSentence: '这只猫很可爱。',
        examplePinyin: 'Zhè zhī māo hěn kě\'ài.',
        exampleThai: 'แมวตัวนี้เป็นมิตรและน่ารักมาก',
        exampleEnglish: 'This cat is very cute.'
      },
      {
        id: 'trad_1_10',
        character: '汉语',
        pinyin: 'Hànyǔ',
        thaiMeaning: 'ภาษาจีน',
        englishMeaning: 'Chinese language',
        pos: 'noun',
        exampleSentence: '汉语不难学。',
        examplePinyin: 'Hànyǔ bù nán xué.',
        exampleThai: 'ภาษาจีนเรียนไม่ยากเลย',
        exampleEnglish: 'Chinese language is not hard to learn.'
      }
    ],
    '2': [
      {
        id: 'trad_2_1',
        character: '咖啡',
        pinyin: 'kāfēi',
        thaiMeaning: 'กาแฟ',
        englishMeaning: 'coffee',
        pos: 'noun',
        exampleSentence: '我不加糖喝咖啡。',
        examplePinyin: 'Wǒ bù jiā táng hē kāfēi.',
        exampleThai: 'ฉันดื่มกาแฟไม่ใส่น้ำตาล',
        exampleEnglish: 'I drink coffee without sugar.'
      },
      {
        id: 'trad_2_2',
        character: '跑步',
        pinyin: 'pǎobù',
        thaiMeaning: 'วิ่ง, วิ่งจ๊อกกิ้ง',
        englishMeaning: 'to run, jog',
        pos: 'verb',
        exampleSentence: '他每天早上跑步。',
        examplePinyin: 'Tā měitiān zǎoshang pǎobù.',
        exampleThai: 'เขาวิ่งทุกเช้า',
        exampleEnglish: 'He runs every morning.'
      },
      {
        id: 'trad_2_3',
        character: '报纸',
        pinyin: 'bàozhǐ',
        thaiMeaning: 'หนังสือพิมพ์',
        englishMeaning: 'newspaper',
        pos: 'noun',
        exampleSentence: '爸爸在看报纸。',
        examplePinyin: 'Bàba zài kàn bàozhǐ.',
        exampleThai: 'คุณพ่อกำลังอ่านหนังสือพิมพ์',
        exampleEnglish: 'Dad is reading the newspaper.'
      },
      {
        id: 'trad_2_4',
        character: '机场',
        pinyin: 'jīchǎng',
        thaiMeaning: 'สนามบิน',
        englishMeaning: 'airport',
        pos: 'noun',
        exampleSentence: '我们下午去机场接朋友。',
        examplePinyin: 'Wǒmen xiàwǔ qù jīchǎng jiē péngyou.',
        exampleThai: 'พวกเราจะไปรับเพื่อนที่สนามบินบ่ายนี้',
        exampleEnglish: 'We are going to the airport to pick up friends this afternoon.'
      },
      {
        id: 'trad_2_5',
        character: '旅游',
        pinyin: 'lǚyóu',
        thaiMeaning: 'ท่องเที่ยว',
        englishMeaning: 'to travel, tourism',
        pos: 'verb',
        exampleSentence: '我明年去中国旅游。',
        examplePinyin: 'Wǒ míngnián qù Zhōngguó lǚyóu.',
        exampleThai: 'ปีหน้าฉันจะไปเที่ยวประเทศจีน',
        exampleEnglish: 'I will travel to China next year.'
      },
      {
        id: 'trad_2_6',
        character: '唱歌',
        pinyin: 'chànggē',
        thaiMeaning: 'ร้องเพลง',
        englishMeaning: 'to sing',
        pos: 'verb',
        exampleSentence: '她唱歌唱得很好听。',
        examplePinyin: 'Tā chànggē chàng de hěn hǎotīng.',
        exampleThai: 'เธอร้องเพลงได้เพราะมาก',
        exampleEnglish: 'She sings beautifully.'
      },
      {
        id: 'trad_2_7',
        character: '医生',
        pinyin: 'yīshēng',
        thaiMeaning: 'คุณหมอ',
        englishMeaning: 'doctor',
        pos: 'noun',
        exampleSentence: '我想成为一名医生。',
        examplePinyin: 'Wǒ xiǎng chéngwéi yì míng yīshēng.',
        exampleThai: 'ฉันอยากเป็นคุณหมอ',
        exampleEnglish: 'I want to become a doctor.'
      },
      {
        id: 'trad_2_8',
        character: '便宜',
        pinyin: 'piányi',
        thaiMeaning: 'ราคาถูก',
        englishMeaning: 'cheap, inexpensive',
        pos: 'adjective',
        exampleSentence: '衣服这几天很便宜。',
        examplePinyin: 'Yīfu zhè jǐ tiān hěn piányi.',
        exampleThai: 'เสื้อผ้าราคาถูกมากในช่วงสองสามวันนี้',
        exampleEnglish: 'Clothes are very cheap these days.'
      },
      {
        id: 'trad_2_9',
        character: '准备',
        pinyin: 'zhǔnbèi',
        thaiMeaning: 'เตรียมตัว, เตรียมพร้อม',
        englishMeaning: 'to prepare, get ready',
        pos: 'verb',
        exampleSentence: '我还没准备好考试。',
        examplePinyin: 'Wǒ hái méi zhǔnbèi hǎo kǎoshì.',
        exampleThai: 'ฉันยังไม่พร้อมสำหรับการสอบ',
        exampleEnglish: 'I am not prepared for the exam yet.'
      },
      {
        id: 'trad_2_10',
        character: '铅笔',
        pinyin: 'qiānbǐ',
        thaiMeaning: 'ดินสอ',
        englishMeaning: 'pencil',
        pos: 'noun',
        exampleSentence: '请借我一支铅笔。',
        examplePinyin: 'Qǐng jiè wǒ yì zhī qiānbǐ.',
        exampleThai: 'ขอยืมดินสอหน่อยได้ไหม',
        exampleEnglish: 'Please lend me a pencil.'
      }
    ],
    '3': [
      {
        id: 'trad_3_1',
        character: '愿意',
        pinyin: 'yuànyì',
        thaiMeaning: 'ยินยอม, สมัครใจ',
        englishMeaning: 'willing, would like to',
        pos: 'verb',
        exampleSentence: '你愿意嫁给我吗？',
        examplePinyin: 'Nǐ yuànyì jià gěi wǒ ma?',
        exampleThai: 'คุณแต่งงานกับผมไหม?',
        exampleEnglish: 'Are you willing to marry me?'
      },
      {
        id: 'trad_3_2',
        character: '感冒',
        pinyin: 'gǎnmào',
        thaiMeaning: 'เป็นหวัด',
        englishMeaning: 'to catch a cold',
        pos: 'verb',
        exampleSentence: '天气冷了，容易感冒。',
        examplePinyin: 'Tiānqì lěng le, róngyì gǎnmào.',
        exampleThai: 'อากาศหนาวแล้ว เป็นหวัดได้ง่าย',
        exampleEnglish: 'The weather is cold, it is easy to catch a cold.'
      },
      {
        id: 'trad_3_3',
        character: '满意',
        pinyin: 'mǎnyì',
        thaiMeaning: 'พึงพอใจ',
        englishMeaning: 'satisfied, pleased',
        pos: 'adjective',
        exampleSentence: '经理对我的工作很满意。',
        examplePinyin: 'Jīnglǐ duì wǒ de gōngzuò hěn mǎnyì.',
        exampleThai: 'ผู้จัดการพึงพอใจกับงานของฉันมาก',
        exampleEnglish: 'The manager is very satisfied with my work.'
      },
      {
        id: 'trad_3_4',
        character: '决定',
        pinyin: 'juédìng',
        thaiMeaning: 'ตัดสินใจ',
        englishMeaning: 'to decide, decision',
        pos: 'verb',
        exampleSentence: '我已经决定出国了。',
        examplePinyin: 'Wǒ yǐjīng juédìng chūguó le.',
        exampleThai: 'ฉันตัดสินใจไปต่างประเทศแล้ว',
        exampleEnglish: 'I have already decided to go abroad.'
      },
      {
        id: 'trad_3_5',
        character: '关系',
        pinyin: 'guānxi',
        thaiMeaning: 'ความสัมพันธ์, เกี่ยวข้อง',
        englishMeaning: 'relation, relationship',
        pos: 'noun',
        exampleSentence: '这件事和我没有关系。',
        examplePinyin: 'Zhè jiàn shì hé wǒ méiyǒu guānxi.',
        exampleThai: 'เรื่องนี้ไม่เกี่ยวข้องกับฉัน',
        exampleEnglish: 'This matter has nothing to do with me.'
      },
      {
        id: 'trad_3_6',
        character: '影响',
        pinyin: 'yǐngxiǎng',
        thaiMeaning: 'มีอิทธิพล, ส่งผลกระทบ',
        englishMeaning: 'to influence, affect',
        pos: 'verb',
        exampleSentence: '别让坏习惯影响你的生活。',
        examplePinyin: 'Bié ràng huài xíguàn yǐngxiǎng nǐ de shēnghuó.',
        exampleThai: 'อย่าปล่อยให้นิสัยเสียส่งผลกระทบต่อชีวิตของคุณ',
        exampleEnglish: 'Do not let bad habits affect your life.'
      },
      {
        id: 'trad_3_7',
        character: '声音',
        pinyin: 'shēngyīn',
        thaiMeaning: 'เสียง',
        englishMeaning: 'sound, voice',
        pos: 'noun',
        exampleSentence: '雨声很大。',
        examplePinyin: 'Yǔshēng hěn dà.',
        exampleThai: 'เสียงฝนดังมาก',
        exampleEnglish: 'The sound of the rain is very loud.'
      },
      {
        id: 'trad_3_8',
        character: '奇怪',
        pinyin: 'qíguài',
        thaiMeaning: 'แปลก, ประหลาด',
        englishMeaning: 'strange, odd',
        pos: 'adjective',
        exampleSentence: '这件事情真奇怪。',
        examplePinyin: 'Zhè jiàn shìqíng zhēn qíguài.',
        exampleThai: 'เรื่องนี้แปลกจริงๆ',
        exampleEnglish: 'This thing is really strange.'
      },
      {
        id: 'trad_3_9',
        character: '相信',
        pinyin: 'xiāngxìn',
        thaiMeaning: 'เชื่อมั่น, เชื่อถือ',
        englishMeaning: 'to believe, trust',
        pos: 'verb',
        exampleSentence: '你要相信自己的能力。',
        examplePinyin: 'Nǐ yào xiāngxìn zìjǐ de nénglì.',
        exampleThai: 'คุณต้องเชื่อมั่นในความสามารถของตนเอง',
        exampleEnglish: 'You must believe in your own abilities.'
      },
      {
        id: 'trad_3_10',
        character: '解决',
        pinyin: 'jiějué',
        thaiMeaning: 'แก้ไข (ปัญหา)',
        englishMeaning: 'to solve, resolve',
        pos: 'verb',
        exampleSentence: '我们会找到解决问题的办法。',
        examplePinyin: 'Wǒmen huì zhǎodào jiějué wèntí de bànfǎ.',
        exampleThai: 'พวกเราจะพบวิธีแก้ไขปัญหา',
        exampleEnglish: 'We will find a way to solve the problem.'
      }
    ],
    '4': [
      {
        id: 'trad_4_1',
        character: '积极',
        pinyin: 'jījí',
        thaiMeaning: 'กระตือรือร้น, เชิงบวก',
        englishMeaning: 'positive, active',
        pos: 'adjective',
        exampleSentence: '我们应当保持积极的态度。',
        examplePinyin: 'Wǒmen yīngdāng bǎochí jījí de tàidù.',
        exampleThai: 'เราควรทัศนคติในเชิงบวกไว้',
        exampleEnglish: 'We should maintain a positive attitude.'
      },
      {
        id: 'trad_4_2',
        character: '复杂',
        pinyin: 'fùzá',
        thaiMeaning: 'ซับซ้อน',
        englishMeaning: 'complex, complicated',
        pos: 'adjective',
        exampleSentence: '这个问题很复杂，很难回答。',
        examplePinyin: 'Zhè ge wèntí hěn fùzá, hěn nán huídá.',
        exampleThai: 'ปัญหานี้ซับซ้อนมาก ตอบยากมาก',
        exampleEnglish: 'This problem is very complex and hard to answer.'
      },
      {
        id: 'trad_4_3',
        character: '幽默',
        pinyin: 'yōumò',
        thaiMeaning: 'ตลก, มีอารมณ์ขัน',
        englishMeaning: 'humorous',
        pos: 'adjective',
        exampleSentence: '李老师是一个非常幽默的人。',
        examplePinyin: 'Lǐ lǎoshī shì yí gè fēicháng yōumò de rén.',
        exampleThai: 'คุณครูหลี่เป็นคนตลกมาก',
        exampleEnglish: 'Teacher Li is a very humorous person.'
      },
      {
        id: 'trad_4_4',
        character: '经验',
        pinyin: 'jīngyàn',
        thaiMeaning: 'ประสบการณ์',
        englishMeaning: 'experience',
        pos: 'noun',
        exampleSentence: '他有很多教学经验。',
        examplePinyin: 'Tā yǒu hěn duō jiàoxué jīngyàn.',
        exampleThai: 'เขามีประสบการณ์การสอนเยอะมาก',
        exampleEnglish: 'He has a lot of teaching experience.'
      },
      {
        id: 'trad_4_5',
        character: '招聘',
        pinyin: 'zhāopìn',
        thaiMeaning: 'รับสมัครงาน, สรรหาคน',
        englishMeaning: 'recruit, hire',
        pos: 'verb',
        exampleSentence: '我们公司正在招聘新员工。',
        examplePinyin: 'Wǒmen gōngsī zhèngzài zhāopìn xīn yuángōng.',
        exampleThai: 'บริษัทเรากำลังรับสมัครพนักงานใหม่',
        exampleEnglish: 'Our company is currently recruiting new employees.'
      }
    ],
    '5': [
      {
        id: 'trad_5_1',
        character: '核心',
        pinyin: 'héxīn',
        thaiMeaning: 'แกนกลาง, ส่วนประกอบสำคัญ',
        englishMeaning: 'core, nucleus',
        pos: 'noun',
        exampleSentence: '我们要解决核心问题。',
        examplePinyin: 'Wǒmen yào jiějué héxīn wèntí.',
        exampleThai: 'พวกเราต้องแก้ไขที่แกนกลางของปัญหา',
        exampleEnglish: 'We need to solve the core problem.'
      },
      {
        id: 'trad_5_2',
        character: '促进',
        pinyin: 'cùjìn',
        thaiMeaning: 'ส่งเสริม, กระตุ้นให้เกิด',
        englishMeaning: 'promote, facilitate',
        pos: 'verb',
        exampleSentence: '阅读可以促进语言学习。',
        examplePinyin: 'Yuèdú kěyǐ cùjìn yǔyán xuéxí.',
        exampleThai: 'การอ่านสามารถส่งเสริมการเรียนรู้ภาษาได้',
        exampleEnglish: 'Reading can promote language learning.'
      },
      {
        id: 'trad_5_3',
        character: '矛盾',
        pinyin: 'máodùn',
        thaiMeaning: 'ความขัดแย้ง, แย้งกัน',
        englishMeaning: 'contradiction, conflict',
        pos: 'noun',
        exampleSentence: '他们之间产生了一些矛盾。',
        examplePinyin: 'Tāmen zhījiān chǎnshēng le yìxiē máodùn.',
        exampleThai: 'เกิดความขัดแย้งบางประการระหว่างพวกเค้า',
        exampleEnglish: 'Some contradictions arose between them.'
      }
    ],
    '6': [
      {
        id: 'trad_6_1',
        character: '频繁',
        pinyin: 'pínfán',
        thaiMeaning: 'บ่อยครั้ง, ถี่ๆ',
        englishMeaning: 'frequent, constantly',
        pos: 'adjective',
        exampleSentence: '他们之间频繁发生联系。',
        examplePinyin: 'Tāmen zhījiān pínfán fāshēng liánxì.',
        exampleThai: 'พวกเขามีการติดต่อระหว่างกันอย่างบ่อยครั้ง',
        exampleEnglish: 'They contact each other frequently.'
      },
      {
        id: 'trad_6_2',
        character: '崩溃',
        pinyin: 'bēngkuì',
        thaiMeaning: 'พังทลาย, สติแตก',
        englishMeaning: 'collapse, breakdown',
        pos: 'verb',
        exampleSentence: '经济体系瞬间崩溃了。',
        examplePinyin: 'Jīngjì tǐxì shùnjiān bēngkuì le.',
        exampleThai: 'ระบบเศรษฐกิจพังทลายลงในพริบตา',
        exampleEnglish: 'The economic system collapsed in an instant.'
      },
      {
        id: 'trad_6_3',
        character: '尴尬',
        pinyin: 'gāngà',
        thaiMeaning: 'กระอักกระอ่วน, เขินอาย, วางตัวไม่ถูก',
        englishMeaning: 'awkward, embarrassed',
        pos: 'adjective',
        exampleSentence: '突然忘词让我感到非常尴尬。',
        examplePinyin: 'Tūrán wàng cí ràng wǒ gǎndào fēicháng gāngà.',
        exampleThai: 'การลืมบทกระทันหันทำให้ฉันรู้สึกกระอักกระอ่วนมาก',
        exampleEnglish: 'Suddenly forgetting my lines made me feel very embarrassed.'
      }
    ]
  },
  new: {
    '1': [
      {
        id: 'new_1_1',
        character: '我',
        pinyin: 'wǒ',
        thaiMeaning: 'ฉัน, ผม',
        englishMeaning: 'I, me',
        pos: 'pronoun',
        exampleSentence: '我学习汉语。',
        examplePinyin: 'Wǒ xuéxí Hànyǔ.',
        exampleThai: 'ฉันเรียนภาษาจีน',
        exampleEnglish: 'I study Chinese.'
      },
      {
        id: 'new_1_2',
        character: '你',
        pinyin: 'nǐ',
        thaiMeaning: 'คุณ, เธอ',
        englishMeaning: 'you',
        pos: 'pronoun',
        exampleSentence: '你身体好吗？',
        examplePinyin: 'Nǐ shēntǐ hǎo ma?',
        exampleThai: 'เธอสบายดีไหม?',
        exampleEnglish: 'Are you in good health?'
      },
      {
        id: 'new_1_3',
        character: '好',
        pinyin: 'hǎo',
        thaiMeaning: 'ดี',
        englishMeaning: 'good, well',
        pos: 'adjective',
        exampleSentence: '今天天气很好。',
        examplePinyin: 'Jīntiān tiānqì hěn hǎo.',
        exampleThai: 'วันนี้อากาศดีมาก',
        exampleEnglish: 'Today\'s weather is very good.'
      },
      {
        id: 'new_1_4',
        character: '谢谢',
        pinyin: 'xièxie',
        thaiMeaning: 'ขอบคุณ',
        englishMeaning: 'thank you',
        pos: 'verb',
        exampleSentence: '谢谢你帮我。',
        examplePinyin: 'Xièxie nǐ bāng wǒ.',
        exampleThai: 'ขอบคุณที่คุณช่วยฉัน',
        exampleEnglish: 'Thank you for helping me.'
      },
      {
        id: 'new_1_5',
        character: '家',
        pinyin: 'jiā',
        thaiMeaning: 'บ้าน, ครอบครัว',
        englishMeaning: 'home, family',
        pos: 'noun',
        exampleSentence: '我爱我的家。',
        examplePinyin: 'Wǒ ài wǒ de jiā.',
        exampleThai: 'ฉันรักบ้านของฉัน',
        exampleEnglish: 'I love my family.'
      }
    ],
    '2': [
      {
        id: 'new_2_1',
        character: '苹果',
        pinyin: 'píngguǒ',
        thaiMeaning: 'แอปเปิ้ล',
        englishMeaning: 'apple',
        pos: 'noun',
        exampleSentence: '我每天吃一个苹果。',
        examplePinyin: 'Wǒ měitiān chī yí gè píngguǒ.',
        exampleThai: 'ฉันกินแอปเปิ้ลหนึ่งผลทุกวัน',
        exampleEnglish: 'I eat an apple every day.'
      },
      {
        id: 'new_2_2',
        character: '喝',
        pinyin: 'hē',
        thaiMeaning: 'ดื่ม',
        englishMeaning: 'to drink',
        pos: 'verb',
        exampleSentence: '我想喝一杯水。',
        examplePinyin: 'Wǒ xiǎng hē yì bēi shuǐ.',
        exampleThai: 'ฉันอยากดื่มน้ำสักแก้ว',
        exampleEnglish: 'I want to drink a glass of water.'
      },
      {
        id: 'new_2_3',
        character: '水',
        pinyin: 'shuǐ',
        thaiMeaning: 'น้ำ',
        englishMeaning: 'water',
        pos: 'noun',
        exampleSentence: '水是生命的源泉。',
        examplePinyin: 'Shuǐ shì shēngmìng de yuánquán.',
        exampleThai: 'น้ำคือแหล่งกำเนิดของชีวิต',
        exampleEnglish: 'Water is the source of life.'
      },
      {
        id: 'new_2_4',
        character: '猫',
        pinyin: 'māo',
        thaiMeaning: 'แมว',
        englishMeaning: 'cat',
        pos: 'noun',
        exampleSentence: '这只猫很可爱。',
        examplePinyin: 'Zhè zhī māo hěn kě\'ài.',
        exampleThai: 'แมวตัวนี้เป็นมิตรและน่ารักมาก',
        exampleEnglish: 'This cat is very cute.'
      },
      {
        id: 'new_2_5',
        character: '汉语',
        pinyin: 'Hànyǔ',
        thaiMeaning: 'ภาษาจีน',
        englishMeaning: 'Chinese language',
        pos: 'noun',
        exampleSentence: '汉语不难学。',
        examplePinyin: 'Hànyǔ bù nán xué.',
        exampleThai: 'ภาษาจีนเรียนไม่ยากเลย',
        exampleEnglish: 'Chinese language is not hard to learn.'
      }
    ],
    '3': [
      {
        id: 'new_3_1',
        character: '咖啡',
        pinyin: 'kāfēi',
        thaiMeaning: 'กาแฟ',
        englishMeaning: 'coffee',
        pos: 'noun',
        exampleSentence: '我不加糖喝咖啡。',
        examplePinyin: 'Wǒ bù jiā táng hē kāfēi.',
        exampleThai: 'ฉันดื่มกาแฟไม่ใส่น้ำตาล',
        exampleEnglish: 'I drink coffee without sugar.'
      },
      {
        id: 'new_3_2',
        character: '跑步',
        pinyin: 'pǎobù',
        thaiMeaning: 'วิ่ง, วิ่งจ๊อกกิ้ง',
        englishMeaning: 'to run, jog',
        pos: 'verb',
        exampleSentence: '他每天早上跑步。',
        examplePinyin: 'Tā měitiān zǎoshang pǎobù.',
        exampleThai: 'เขาวิ่งทุกเช้า',
        exampleEnglish: 'He runs every morning.'
      },
      {
        id: 'new_3_3',
        character: '报纸',
        pinyin: 'bàozhǐ',
        thaiMeaning: 'หนังสือพิมพ์',
        englishMeaning: 'newspaper',
        pos: 'noun',
        exampleSentence: '爸爸在看报纸。',
        examplePinyin: 'Bàba zài kàn bàozhǐ.',
        exampleThai: 'คุณพ่อกำลังอ่านหนังสือพิมพ์',
        exampleEnglish: 'Dad is reading the newspaper.'
      },
      {
        id: 'new_3_4',
        character: '机场',
        pinyin: 'jīchǎng',
        thaiMeaning: 'สนามบิน',
        englishMeaning: 'airport',
        pos: 'noun',
        exampleSentence: '我们下午去机场接朋友。',
        examplePinyin: 'Wǒmen xiàwǔ qù jīchǎng jiē péngyou.',
        exampleThai: 'พวกเราจะไปรับเพื่อนที่สนามบินบ่ายนี้',
        exampleEnglish: 'We are going to the airport to pick up friends this afternoon.'
      },
      {
        id: 'new_3_5',
        character: '旅游',
        pinyin: 'lǚyóu',
        thaiMeaning: 'ท่องเที่ยว',
        englishMeaning: 'to travel, tourism',
        pos: 'verb',
        exampleSentence: '我明年去中国旅游。',
        examplePinyin: 'Wǒ míngnián qù Zhōngguó lǚyóu.',
        exampleThai: 'ปีหน้าฉันจะไปเที่ยวประเทศจีน',
        exampleEnglish: 'I will travel to China next year.'
      }
    ],
    '4': [
      {
        id: 'new_4_1',
        character: '决定',
        pinyin: 'juédìng',
        thaiMeaning: 'ตัดสินใจ',
        englishMeaning: 'to decide, decision',
        pos: 'verb',
        exampleSentence: '我已经决定出国了。',
        examplePinyin: 'Wǒ yǐjīng juédìng chūguó le.',
        exampleThai: 'ฉันตัดสินใจไปต่างประเทศแล้ว',
        exampleEnglish: 'I have already decided to go abroad.'
      },
      {
        id: 'new_4_2',
        character: '关系',
        pinyin: 'guānxi',
        thaiMeaning: 'ความสัมพันธ์, เกี่ยวข้อง',
        englishMeaning: 'relation, relationship',
        pos: 'noun',
        exampleSentence: '这件事和我没有关系。',
        examplePinyin: 'Zhè jiàn shì hé wǒ méiyǒu guānxi.',
        exampleThai: 'เรื่องนี้ไม่เกี่ยวข้องกับฉัน',
        exampleEnglish: 'This matter has nothing to do with me.'
      },
      {
        id: 'new_4_3',
        character: '解决',
        pinyin: 'jiějué',
        thaiMeaning: 'แก้ไข (ปัญหา)',
        englishMeaning: 'to solve, resolve',
        pos: 'verb',
        exampleSentence: '我们会找到解决问题的办法。',
        examplePinyin: 'Wǒmen huì zhǎodào jiějué wèntí de bànfǎ.',
        exampleThai: 'พวกเราจะพบวิธีแก้ไขปัญหา',
        exampleEnglish: 'We will find a way to solve the problem.'
      }
    ],
    '5': [
      {
        id: 'new_5_1',
        character: '积极',
        pinyin: 'jījí',
        thaiMeaning: 'กระตือรือร้น, เชิงบวก',
        englishMeaning: 'positive, active',
        pos: 'adjective',
        exampleSentence: '我们应当保持积极的态度。',
        examplePinyin: 'Wǒmen yīngdāng bǎochí jījí de tàidù.',
        exampleThai: 'เราควรทัศนคติในเชิงบวกไว้',
        exampleEnglish: 'We should maintain a positive attitude.'
      },
      {
        id: 'new_5_2',
        character: '招聘',
        pinyin: 'zhāopìn',
        thaiMeaning: 'รับสมัครงาน, สรรหาคน',
        englishMeaning: 'recruit, hire',
        pos: 'verb',
        exampleSentence: '我们公司正在招聘新员工。',
        examplePinyin: 'Wǒmen gōngsī zhèngzài zhāopìn xīn yuángōng.',
        exampleThai: 'บริษัทเรากำลังรับสมัครพนักงานใหม่',
        exampleEnglish: 'Our company is currently recruiting new employees.'
      }
    ],
    '6': [
      {
        id: 'new_6_1',
        character: '促进',
        pinyin: 'cùjìn',
        thaiMeaning: 'ส่งเสริม, กระตุ้นให้เกิด',
        englishMeaning: 'promote, facilitate',
        pos: 'verb',
        exampleSentence: '阅读可以促进语言学习。',
        examplePinyin: 'Yuèdú kěyǐ cùjìn yǔyán xuéxí.',
        exampleThai: 'การอ่านสามารถส่งเสริมการเรียนรู้ภาษาได้',
        exampleEnglish: 'Reading can promote language learning.'
      },
      {
        id: 'new_6_2',
        character: '逻辑',
        pinyin: 'luójí',
        thaiMeaning: 'ตรรกะ, ความมีเหตุผล',
        englishMeaning: 'logic',
        pos: 'noun',
        exampleSentence: '他的文章逻辑性很强。',
        examplePinyin: 'Tā de wénzhāng luójíxìng hěn qiáng.',
        exampleThai: 'บทความของเขามีความตรรกะที่แข็งแกร่งมาก',
        exampleEnglish: 'His article has very strong logic.'
      }
    ],
    '7': [
      {
        id: 'new_7_1',
        character: '频繁',
        pinyin: 'pínfán',
        thaiMeaning: 'บ่อยครั้ง, ถี่ๆ',
        englishMeaning: 'frequent, constantly',
        pos: 'adjective',
        exampleSentence: '他们之间频繁发生联系。',
        examplePinyin: 'Tāmen zhījiān pínfán fāshēng liánxì.',
        exampleThai: 'พวกเขามีการติดต่อระหว่างกันอย่างบ่อยครั้ง',
        exampleEnglish: 'They contact each other frequently.'
      },
      {
        id: 'new_7_2',
        character: '崩溃',
        pinyin: 'bēngkuì',
        thaiMeaning: 'พังทลาย, สติแตก',
        englishMeaning: 'collapse, breakdown',
        pos: 'verb',
        exampleSentence: '经济体系瞬间崩溃了。',
        examplePinyin: 'Jīngjì tǐxì shùnjiān bēngkuì le.',
        exampleThai: 'ระบบเศรษฐกิจพังทลายลงในพริบตา',
        exampleEnglish: 'The economic system collapsed in an instant.'
      }
    ],
    '8': [
      {
        id: 'new_8_1',
        character: '衡量',
        pinyin: 'héngliang',
        thaiMeaning: 'ชั่งน้ำหนัก, วัดขนาด, ประเมิน',
        englishMeaning: 'measure, weigh, evaluate',
        pos: 'verb',
        exampleSentence: '不能仅用金钱来衡量成功。',
        examplePinyin: 'Bù néng jǐn yòng jīnqián lái héngliang chénggōng.',
        exampleThai: 'ไม่สามารถประเมินความสำเร็จด้วยเงินเพียงอย่างเดียว',
        exampleEnglish: 'Success cannot be measured by money alone.'
      },
      {
        id: 'new_8_2',
        character: '视野',
        pinyin: 'shìyě',
        thaiMeaning: 'ขอบเขตสายตา, วิสัยทัศน์, ทัศนคติ',
        englishMeaning: 'field of vision, horizon, outlook',
        pos: 'noun',
        exampleSentence: '出国留学开阔了他的视野。',
        examplePinyin: 'Chūguó liúxué kāikuò le tā de shìyě.',
        exampleThai: 'การศึกษาต่อต่างประเทศทำให้ทัศนวิสัยของเขาเปิดกว้างขึ้น',
        exampleEnglish: 'Studying abroad broadened his horizons.'
      }
    ],
    '9': [
      {
        id: 'new_9_1',
        character: '融会贯通',
        pinyin: 'rónghuì guàntōng',
        thaiMeaning: 'หลอมรวมเชื่อมโยงเป็นอันหนึ่งอันเดียวอย่างทะลุปรุโปร่ง',
        englishMeaning: 'achieve a comprehensive understanding, integrate systematically',
        pos: 'idiom',
        exampleSentence: '读书要把各科知识融会贯通。',
        examplePinyin: 'Dúshū yào bǎ gè kē zhīshi rónghuì guàntōng.',
        exampleThai: 'การอ่านหนังสือจำเป็นต้องเชื่อมโยงความรู้ของแต่ละวิชาเข้าด้วยกันอย่างทะลุปรุโปร่ง',
        exampleEnglish: 'Studying requires integrating knowledge from all subjects comprehensively.'
      },
      {
        id: 'new_9_2',
        character: '见仁见智',
        pinyin: 'jiànrén jiànzhì',
        thaiMeaning: 'มุมมองที่ต่างกันไปตามความคิดของแต่ละคน (นานาจิตตัง)',
        englishMeaning: 'different people have different views',
        pos: 'idiom',
        exampleSentence: '关于这件作品的评价见仁见智。',
        examplePinyin: 'Guānyú zhè jiàn zuòpǐn de píngjià jiànrén jiànzhì.',
        exampleThai: 'ความคิดเห็นเกี่ยวกับผลงานชิ้นนี้ต่างจิตต่างใจกันไป',
        exampleEnglish: 'Evaluations of this piece of work vary from person to person.'
      }
    ]
  }
};
