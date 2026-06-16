// ============================================================
// CONTENT POOL — 10 languages, 150 levels, 150-300 word paragraphs
// ============================================================

export type Language =
  | "english" | "hindi" | "urdu" | "arabic"
  | "bengali" | "tamil" | "marathi"
  | "french" | "german" | "spanish";

export const SUPPORTED_LANGUAGES: { id: Language; label: string; flag: string; script: "latin" | "devanagari" | "arabic" | "bengali" | "tamil" }[] = [
  { id: "english",  label: "English",  flag: "🇬🇧", script: "latin" },
  { id: "hindi",    label: "Hindi",    flag: "🇮🇳", script: "devanagari" },
  { id: "urdu",     label: "Urdu",     flag: "🇵🇰", script: "arabic" },
  { id: "arabic",   label: "Arabic",   flag: "🇸🇦", script: "arabic" },
  { id: "bengali",  label: "Bengali",  flag: "🇧🇩", script: "bengali" },
  { id: "tamil",    label: "Tamil",    flag: "🇮🇳", script: "tamil" },
  { id: "marathi",  label: "Marathi",  flag: "🇮🇳", script: "devanagari" },
  { id: "french",   label: "French",   flag: "🇫🇷", script: "latin" },
  { id: "german",   label: "German",   flag: "🇩🇪", script: "latin" },
  { id: "spanish",  label: "Spanish",  flag: "🇪🇸", script: "latin" },
];

// ─── English ───────────────────────────────────────────────
const ENGLISH_EASY = [
  "The cat sat on the mat and looked around the quiet room. A friendly dog slept near the wooden door. The warm sun shone through the glass window, making patterns on the floor. Birds sang cheerful songs in the tall oak tree outside. Children played happily in the garden, their laughter filling the air. It was a beautiful and peaceful day. Everyone felt calm and content in the gentle afternoon breeze. The flowers in the garden bloomed with bright colours of red, yellow, and pink. A butterfly landed softly on a rose and stayed for a moment before flying away.",

  "Learning to type well is one of the most useful skills a person can have in the modern world. With computers being used in every office, school, and home, fast and accurate typing saves a lot of time. The correct way to type is to place your fingers on the home row keys and use all ten fingers. Each finger is responsible for a specific group of keys. With daily practice of at least thirty minutes, most people can double their typing speed within a few months. The key is to be consistent and patient with yourself.",

  "India is a large and diverse country with many different cultures, languages, and traditions. It is home to more than one billion people who speak hundreds of different languages and dialects. The country has ancient temples, beautiful mountains, vast deserts, and long coastlines. Indian food is famous all over the world for its rich spices and flavours. Festivals like Diwali, Eid, Holi, and Christmas are all celebrated with great joy and enthusiasm. India has made great progress in science, technology, agriculture, and space research in recent decades.",

  "Good health is the most precious gift that a person can have in life. Without good health, all the wealth and success in the world means very little. To stay healthy, one must eat a balanced diet that includes fruits, vegetables, whole grains, and proteins. Regular physical exercise, such as walking, swimming, or yoga, keeps the body strong and the mind sharp. Getting enough sleep is equally important for maintaining energy and focus throughout the day. Drinking plenty of clean water and avoiding junk food are also essential habits for a long and healthy life.",

  "Reading books is one of the best habits that anyone can develop. Books open the door to new worlds, new ideas, and new ways of thinking. Whether you prefer fiction, non-fiction, history, science, or poetry, there is always something valuable to learn from reading. Regular readers tend to have larger vocabularies and better communication skills than those who do not read often. Many successful people in history have credited their success partly to their love of reading. Making time to read even just twenty pages a day can make a significant difference in your knowledge and outlook.",
];

const ENGLISH_MEDIUM = [
  "The rapid advancement of digital technology over the past two decades has fundamentally transformed the way human beings communicate, work, and access information. The internet, which was once available only to research institutions and government agencies, is now accessible to billions of people around the globe. Social media platforms have enabled individuals to share their thoughts, experiences, and creative works with audiences they could never have reached before. However, this digital revolution has also brought new challenges, including concerns about privacy, misinformation, cybersecurity, and the psychological effects of excessive screen time on children and adults alike.",

  "Government typing examinations in India are among the most competitive assessments for clerical and administrative positions in the public sector. Candidates appearing for SSC, railway, court, and state government typing tests must demonstrate proficiency in producing accurate transcriptions at speeds ranging from thirty to fifty words per minute in English and twenty-five to thirty-five words per minute in Hindi. The evaluation is strict, with penalties applied for each error exceeding the permissible limit. Aspirants are advised to practice daily using authentic exam passages and to focus equally on speed improvement and accuracy maintenance throughout their preparation period.",

  "Environmental degradation has emerged as one of the most pressing challenges facing humanity in the twenty-first century. The burning of fossil fuels for energy production and transportation releases enormous quantities of carbon dioxide and other greenhouse gases into the atmosphere, contributing to global warming and climate change. Deforestation, industrial pollution, plastic waste, and unsustainable agricultural practices further compound the damage to ecosystems worldwide. Scientists warn that without immediate and coordinated global action to reduce emissions and restore natural habitats, the consequences for future generations will be severe, including rising sea levels, extreme weather events, and the collapse of biodiversity.",

  "The Supreme Court of India serves as the apex judicial body and functions as the final court of appeal in all civil and criminal matters arising under the Constitution and laws of the land. It exercises original jurisdiction in disputes between states and the Union government, appellate jurisdiction over high court decisions, and advisory jurisdiction when the President of India seeks its opinion on questions of law or fact. The court's landmark judgments have shaped India's legal landscape in areas ranging from fundamental rights and constitutional interpretation to environmental law, criminal justice reform, and the protection of marginalized communities.",

  "Time management is a skill that separates high-performing individuals from those who constantly feel overwhelmed and behind schedule. Successful professionals understand that time is a finite and non-renewable resource that must be allocated thoughtfully. They begin each day with a clear list of priorities, focusing first on tasks that are both important and urgent before moving on to those that are important but not time-sensitive. They use calendars, productivity tools, and dedicated work blocks to maintain focus and avoid the trap of reactive work driven by interruptions and distractions. Regular review of progress and adjustment of plans ensures that long-term goals remain on track.",
];

const ENGLISH_HARD = [
  "The jurisprudential frameworks governing constitutional democracies have evolved considerably since the Enlightenment period, when natural law theorists first articulated the notion that certain rights are inherent to human beings by virtue of their rational nature rather than conferred by sovereign authority. Contemporary constitutional scholarship navigates a complex terrain that encompasses originalist interpretation, living constitutionalism, proportionality analysis, and comparative constitutional borrowing. Each methodological approach carries distinct implications for judicial review, separation of powers doctrine, and the protection of fundamental liberties against majoritarian encroachment, raising perennial questions about the legitimate role of unelected judges in democratic systems.",

  "Macroeconomic stabilization policies implemented in the aftermath of the global financial crisis of two thousand and eight revealed the limitations of conventional monetary and fiscal instruments when interest rates approach the zero lower bound and fiscal space is constrained by elevated sovereign debt ratios. Central banks across advanced economies experimented with unconventional measures including quantitative easing, forward guidance, negative interest rates, and large-scale asset purchase programmes. While these interventions succeeded in averting a complete collapse of the financial system and stimulating a fragile recovery, they also generated significant distributional consequences, inflated asset price valuations, and complicated the eventual normalization of monetary policy frameworks.",

  "The intersection of artificial intelligence, machine learning, and natural language processing has produced transformative technologies capable of generating coherent textual content, translating between hundreds of languages, summarizing complex documents, and engaging in sophisticated dialogue with human interlocutors. Large language models trained on vast corpora of textual data exhibit emergent capabilities that were not explicitly programmed, raising fundamental questions about the nature of intelligence, creativity, and understanding. Regulatory frameworks governing the deployment of these systems must balance the imperative to foster innovation with legitimate concerns about algorithmic bias, accountability, intellectual property rights, labor market disruption, and the potential misuse of generative AI for disinformation campaigns.",

  "The implementation of comprehensive tax reform programmes in developing economies requires navigating a delicate balance between expanding revenue collection to finance essential public services and avoiding disincentive effects on investment, entrepreneurship, and productive economic activity. Goods and services tax harmonization eliminates the cascading effect of multiple-stage indirect taxation while creating administrative challenges related to compliance, refund processing, and differential treatment of exempt goods. Direct tax reforms aimed at broadening the income tax base by removing exemptions and reducing marginal rates must be accompanied by strengthened enforcement mechanisms to curtail tax evasion in the informal economy and improve voluntary compliance.",

  "Epidemiological surveillance and rapid response capabilities constitute the foundational infrastructure upon which effective public health systems depend for detecting, characterizing, and containing infectious disease outbreaks before they achieve epidemic or pandemic scale. The architecture of global health security rests on the International Health Regulations framework, which obligates member states to report events that may constitute public health emergencies of international concern and to develop core capacity in surveillance, laboratory diagnostics, risk communication, and emergency response. Pandemic preparedness investments in genomic sequencing infrastructure, stockpile management, healthcare worker training, and community engagement mechanisms represent a cost-effective strategy for reducing the catastrophic human and economic toll of future pathogen threats.",
];

// ─── Hindi ─────────────────────────────────────────────────
const HINDI_EASY = [
  "भारत एक महान देश है। यहाँ अनेक धर्म, जाति और संस्कृतियाँ एक साथ मिलकर रहती हैं। भारत की संस्कृति बहुत पुरानी और समृद्ध है। यहाँ के लोग मेहनती और प्रतिभाशाली हैं। भारत ने विज्ञान, प्रौद्योगिकी, कला और साहित्य में बड़े-बड़े काम किए हैं। हमारा राष्ट्रीय ध्वज तिरंगा है जिसमें केसरिया, सफेद और हरा रंग है। बीच में अशोक चक्र है। हमें अपने देश पर गर्व होना चाहिए और इसे आगे बढ़ाने के लिए हमेशा कोशिश करनी चाहिए। भारत दुनिया का सबसे बड़ा लोकतंत्र है।",

  "स्वास्थ्य ही सबसे बड़ा धन है। यदि हम स्वस्थ रहेंगे तो हम जीवन के हर काम को अच्छी तरह से कर सकते हैं। स्वस्थ रहने के लिए हमें प्रतिदिन व्यायाम करना चाहिए, संतुलित आहार लेना चाहिए और पर्याप्त नींद लेनी चाहिए। हमें जंक फूड और मीठे पेय पदार्थों से बचना चाहिए। ताजे फल और सब्जियाँ खाने से शरीर को आवश्यक विटामिन और खनिज मिलते हैं। पानी खूब पिएँ और साफ-सफाई का ध्यान रखें। योग और ध्यान मन को शांत रखते हैं और तनाव को कम करते हैं।",

  "पेड़-पौधे हमारे जीवन के लिए बहुत जरूरी हैं। वे हमें ऑक्सीजन देते हैं जिसके बिना हम जी नहीं सकते। पेड़ हवा को साफ करते हैं, मिट्टी को बाँधते हैं और बारिश लाने में मदद करते हैं। पेड़ों की छाया में हम गर्मी से राहत पाते हैं। पक्षी और जानवर भी पेड़ों पर निर्भर रहते हैं। इसलिए हमें पेड़ काटने से बचना चाहिए और अधिक से अधिक पेड़ लगाने चाहिए। वृक्षारोपण अभियानों में भाग लेना हमारा कर्तव्य है। आने वाली पीढ़ियों के लिए हरी-भरी धरती छोड़ना हमारी जिम्मेदारी है।",

  "शिक्षा मनुष्य के जीवन का सबसे महत्वपूर्ण आधार है। शिक्षा के बिना जीवन अधूरा है। शिक्षा हमें सही और गलत की पहचान कराती है। एक शिक्षित व्यक्ति न केवल अपना विकास करता है बल्कि समाज और देश के विकास में भी योगदान देता है। आज डिजिटल युग में शिक्षा के नए-नए माध्यम उपलब्ध हैं। ऑनलाइन पाठ्यक्रम, वीडियो लेक्चर और डिजिटल पुस्तकें शिक्षा को सबके लिए सुलभ बना रही हैं। हमें जीवन भर सीखते रहना चाहिए क्योंकि ज्ञान का कोई अंत नहीं है।",
];

const HINDI_MEDIUM = [
  "भारत सरकार ने डिजिटल भारत मिशन के अंतर्गत देश के हर नागरिक को डिजिटल सेवाओं से जोड़ने का लक्ष्य रखा है। इस अभियान के तहत सरकारी सेवाएँ ऑनलाइन उपलब्ध कराई जा रही हैं और नागरिकों को डिजिटल साक्षरता का प्रशिक्षण दिया जा रहा है। टाइपिंग एक महत्वपूर्ण डिजिटल कौशल है जो सरकारी और निजी दोनों क्षेत्रों में रोजगार के अवसर प्रदान करता है। कंप्यूटर टाइपिंग में दक्षता प्राप्त करने के लिए नियमित अभ्यास आवश्यक है। सरकारी परीक्षाओं में हिंदी टाइपिंग के लिए न्यूनतम गति और शुद्धता का मानक निर्धारित किया गया है जिसे पूरा करना अनिवार्य है।",

  "न्यायालय में काम करने वाले कर्मचारियों के लिए टाइपिंग एक अनिवार्य कौशल है। उन्हें न केवल तेज गति से टाइप करना आता है बल्कि उनकी भाषा और व्याकरण पर भी मजबूत पकड़ होती है। न्यायिक दस्तावेजों में एक भी गलती गंभीर समस्या उत्पन्न कर सकती है, इसलिए शुद्धता पर विशेष ध्यान दिया जाता है। उच्च न्यायालय और सर्वोच्च न्यायालय में हिंदी और अंग्रेजी दोनों भाषाओं में टाइपिंग की आवश्यकता होती है। अभ्यर्थियों को परीक्षा की तैयारी के दौरान वास्तविक न्यायिक प्रारूप के अनुसार अभ्यास करना चाहिए।",

  "पर्यावरण प्रदूषण आज की सबसे गंभीर समस्याओं में से एक है। औद्योगीकरण और शहरीकरण के कारण वायु, जल और भूमि प्रदूषण में तेजी से वृद्धि हो रही है। वाहनों से निकलने वाला धुआँ और कारखानों का कचरा वातावरण को दूषित कर रहा है। प्लास्टिक कचरा नदियों और समुद्रों में जाकर जलीय जीवों को नुकसान पहुँचा रहा है। पर्यावरण संरक्षण के लिए हमें व्यक्तिगत और सामूहिक स्तर पर प्रयास करने होंगे। सरकार को कड़े कानून बनाने चाहिए और उनका पालन सुनिश्चित करना चाहिए। नवीकरणीय ऊर्जा स्रोतों का अधिकतम उपयोग करना चाहिए।",
];

const HINDI_HARD = [
  "भारतीय संविधान विश्व का सबसे विस्तृत और व्यापक लिखित संविधान है जिसे संविधान सभा ने छब्बीस नवंबर उन्नीस सौ उनचास को अंगीकृत किया था। इसमें मूल अधिकार, राज्य के नीति-निदेशक तत्व और मूल कर्तव्य जैसी महत्वपूर्ण व्यवस्थाएँ शामिल हैं। संविधान की संघीय संरचना केंद्र और राज्यों के बीच शक्तियों का स्पष्ट विभाजन करती है। न्यायपालिका की स्वतंत्रता और न्यायिक पुनर्विलोकन की शक्ति संवैधानिक लोकतंत्र के आधार स्तंभ हैं। संसदीय प्रणाली में कार्यपालिका विधायिका के प्रति उत्तरदायी होती है जो जवाबदेही सुनिश्चित करती है।",
];

// ─── Urdu ──────────────────────────────────────────────────
const URDU_EASY = [
  "پاکستان ایک خوبصورت ملک ہے جہاں مختلف قومیں اور ثقافتیں مل کر رہتی ہیں۔ یہاں کے لوگ محنتی اور ذہین ہیں۔ پاکستان کی تاریخ بہت پرانی اور دلچسپ ہے۔ یہاں کی زبان اردو دنیا کی خوبصورت ترین زبانوں میں سے ایک ہے۔ ہمیں اپنے ملک سے محبت کرنی چاہیے اور اسے ترقی دینے کے لیے کوشش کرنی چاہیے۔",

  "علم انسان کی سب سے بڑی دولت ہے۔ تعلیم کے بغیر کوئی بھی ترقی نہیں کر سکتا۔ ہمیں ہمیشہ سیکھنے کی کوشش کرنی چاہیے۔ کتابیں پڑھنا ایک بہترین عادت ہے جو ہمارے علم اور سوچ کو بڑھاتی ہے۔ ہر دن کچھ نیا سیکھنے کی کوشش کریں اور اپنی صلاحیتوں کو بہتر بنائیں۔ محنت اور لگن سے کوئی بھی مقصد حاصل کیا جا سکتا ہے۔",

  "صحت ایک انمول نعمت ہے۔ صحتمند رہنے کے لیے ہمیں متوازن غذا کھانی چاہیے اور روزانہ ورزش کرنی چاہیے۔ پانی خوب پئیں اور تازہ پھل اور سبزیاں کھائیں۔ سونے کا وقت متعین رکھیں اور کافی نیند لیں۔ ذہنی سکون کے لیے نماز اور مراقبہ بہت فائدہ مند ہے۔ صاف صفائی کا خیال رکھیں اور گندگی سے بچیں۔",
];

const URDU_MEDIUM = [
  "پاکستان میں سرکاری ملازمتوں کے لیے ٹائپنگ ایک ضروری مہارت ہے۔ عدالتوں، دفتروں اور سرکاری اداروں میں تیز اور درست ٹائپنگ کی ضرورت ہوتی ہے۔ اردو ٹائپنگ کے لیے خاص کی بورڈ لے آؤٹ استعمال کیا جاتا ہے۔ روزانہ مشق سے ٹائپنگ کی رفتار اور درستگی میں بہتری آتی ہے۔ مختلف سرکاری امتحانوں میں ٹائپنگ کا معیار طے شدہ ہے جسے پورا کرنا ضروری ہے۔",

  "ڈیجیٹل دنیا میں کمپیوٹر کی مہارت بہت اہم ہو گئی ہے۔ آج کل تقریباً ہر شعبے میں کمپیوٹر استعمال ہوتا ہے۔ ٹائپنگ کی مہارت سے آپ کا کام تیز اور آسان ہو جاتا ہے۔ صحیح انگلیوں کی پوزیشن سیکھنا ضروری ہے تاکہ غلطیاں کم ہوں اور رفتار بڑھے۔ باقاعدہ مشق سے چند ہفتوں میں نمایاں بہتری دیکھی جا سکتی ہے۔",
];

// ─── Arabic ────────────────────────────────────────────────
const ARABIC_EASY = [
  "اللغة العربية من أجمل اللغات في العالم وأكثرها ثراءً وعمقاً. تتميز بثراء مفرداتها وجمال أسلوبها ودقة تعبيرها. يتحدثها ما يزيد على أربعمئة مليون شخص حول العالم. إنها لغة القرآن الكريم والتراث الإسلامي العظيم. كما أنها لغة العلم والأدب والحضارة عبر التاريخ.",

  "الصحة نعمة عظيمة من الله يجب المحافظة عليها. لنحافظ على صحتنا يجب أن نتناول الغذاء الصحي المتوازن، ونمارس الرياضة يومياً، ونشرب الماء الكافي. النوم الجيد ضروري لصحة الجسم والعقل. ينبغي الابتعاد عن الأطعمة الضارة والعادات السيئة. الوقاية خير من العلاج، لذا يجب الاهتمام بالنظافة الشخصية والبيئية.",

  "التعليم هو أساس التقدم والازدهار للأفراد والمجتمعات والدول. من خلال التعليم يكتسب الإنسان المعرفة والمهارات التي تمكنه من المساهمة في بناء مجتمعه. القراءة عادة رائعة تفتح أمامنا آفاقاً جديدة وتوسع مداركنا. يجب تشجيع الشباب على القراءة والتعلم المستمر لبناء مستقبل أفضل.",
];

const ARABIC_MEDIUM = [
  "في عصر التكنولوجيا الرقمية الذي نعيشه اليوم، أصبحت مهارة الكتابة على لوحة المفاتيح من المهارات الأساسية التي يحتاجها كل إنسان في حياته اليومية. سواء في العمل أو الدراسة أو التواصل مع الآخرين، تساعدك الكتابة السريعة والدقيقة على إنجاز مهامك بكفاءة أكبر. تعلم الكتابة الصحيحة يتطلب الصبر والممارسة المنتظمة والالتزام بوضع الأصابع الصحيح على مفاتيح الحروف.",
];

// ─── Bengali ───────────────────────────────────────────────
const BENGALI_EASY = [
  "বাংলাদেশ একটি সুন্দর দেশ যেখানে সবুজ মাঠ, নদী এবং বন রয়েছে। এই দেশের মানুষ অতিথিপরায়ণ এবং পরিশ্রমী। বাংলা ভাষা অত্যন্ত মিষ্টি এবং সমৃদ্ধ একটি ভাষা। আমাদের সংস্কৃতি ও ঐতিহ্য অনেক পুরনো এবং গর্বের বিষয়। প্রকৃতির সৌন্দর্যে ভরপুর এই দেশকে আমরা সবাই ভালোবাসি।",

  "শিক্ষা মানুষের সবচেয়ে বড় সম্পদ। শিক্ষা ছাড়া জীবনে এগিয়ে যাওয়া সম্ভব নয়। প্রতিদিন নতুন কিছু শেখার চেষ্টা করুন। বই পড়ার অভ্যাস গড়ে তুলুন কারণ এটি আপনার জ্ঞান ও দৃষ্টিভঙ্গি প্রসারিত করবে। কম্পিউটার টাইপিং শেখা আজকের যুগে একটি অপরিহার্য দক্ষতা যা আপনাকে কর্মক্ষেত্রে এগিয়ে রাখবে।",

  "সুস্বাস্থ্য জীবনের সবচেয়ে বড় সম্পদ। সুস্থ থাকতে হলে নিয়মিত ব্যায়াম করতে হবে, পুষ্টিকর খাবার খেতে হবে এবং পর্যাপ্ত ঘুমাতে হবে। তাজা ফলমূল ও শাকসবজি খান এবং প্রচুর পরিমাণে পানি পান করুন। জাঙ্ক ফুড এড়িয়ে চলুন এবং শরীরকে সক্রিয় রাখুন। মানসিক স্বাস্থ্যের জন্য ধ্যান ও যোগব্যায়াম অত্যন্ত উপকারী।",
];

const BENGALI_MEDIUM = [
  "বাংলাদেশ ও পশ্চিমবঙ্গে সরকারি চাকরির জন্য কম্পিউটার টাইপিং একটি গুরুত্বপূর্ণ দক্ষতা হয়ে উঠেছে। বিভিন্ন সরকারি পরীক্ষায় নির্দিষ্ট গতি ও নির্ভুলতায় টাইপ করার ক্ষমতা প্রমাণ করতে হয়। প্রতিদিন অন্তত ত্রিশ মিনিট অনুশীলন করলে কয়েক সপ্তাহের মধ্যে টাইপিং গতি উল্লেখযোগ্যভাবে বাড়ানো সম্ভব। সঠিক আঙুলের অবস্থান শেখা এবং হোম রো কী থেকে অনুশীলন শুরু করা উচিত।",
];

// ─── Tamil ─────────────────────────────────────────────────
const TAMIL_EASY = [
  "தமிழ் உலகின் மிகவும் பழமையான மொழிகளில் ஒன்று. இது மிகவும் அழகான மற்றும் செழுமையான மொழி. தமிழ் இலக்கியம் இரண்டாயிரம் ஆண்டுகளுக்கும் மேலாக தொடர்கிறது. தமிழ்நாடு பண்பாடு மற்றும் கலைகளில் மிகவும் சிறந்த மாநிலம். நாம் நமது தாய்மொழியை பெருமையுடன் பேச வேண்டும்.",

  "கல்வி மனித வாழ்வின் அடிப்படை. கல்வியின் மூலம் நாம் நம் வாழ்க்கையை சிறப்பாக மாற்றிக்கொள்ளலாம். தினமும் புதிதாக ஏதாவது கற்றுக்கொள்ளும் பழக்கம் வளர்த்துக்கொள்ளுங்கள். கணினி தட்டச்சு திறன் இன்றைய காலத்தில் மிகவும் முக்கியமான ஒரு திறன். தொடர்ந்து பயிற்சி செய்வதன் மூலம் விரைவாகவும் துல்லியமாகவும் தட்டச்சு செய்யலாம்.",

  "ஆரோக்கியம் மிகவும் மதிப்புமிக்க செல்வம். ஆரோக்கியமாக இருக்க சரியான உணவு, தினமும் உடற்பயிற்சி மற்றும் போதுமான தூக்கம் அவசியம். புதிய காய்கறிகள் மற்றும் பழங்கள் சாப்பிடுங்கள். நிறைய தண்ணீர் குடியுங்கள். யோகா மற்றும் தியானம் மன அமைதிக்கு மிகவும் உதவியாக இருக்கும்.",
];

const TAMIL_MEDIUM = [
  "தமிழ்நாடு மற்றும் மத்திய அரசு பணிகளில் கணினி தட்டச்சு ஒரு முக்கியமான திறன். அரசு தேர்வுகளில் குறிப்பிட்ட வேகம் மற்றும் துல்லியத்தில் தட்டச்சு செய்யும் திறனை நிரூபிக்க வேண்டும். தினமும் குறைந்தது முப்பது நிமிடங்கள் பயிற்சி செய்வதன் மூலம் தட்டச்சு வேகத்தை கணிசமாக அதிகரிக்கலாம். சரியான விரல் நிலையை கற்றுக்கொள்வது மிகவும் முக்கியம்.",
];

// ─── Marathi ───────────────────────────────────────────────
const MARATHI_EASY = [
  "महाराष्ट्र हे भारताचे एक प्रमुख राज्य आहे. येथे मराठी संस्कृती, कला आणि साहित्य यांची समृद्ध परंपरा आहे. छत्रपती शिवाजी महाराज हे महाराष्ट्राचे महान राजे होते. मुंबई हे महाराष्ट्राचे राजधानी शहर आणि भारताची आर्थिक राजधानी आहे. मराठी भाषा अत्यंत गोड आणि समृद्ध आहे.",

  "आरोग्य हे सर्वात मोठे धन आहे. आरोग्यासाठी नियमित व्यायाम, संतुलित आहार आणि पुरेशी झोप आवश्यक आहे. ताजी फळे आणि भाज्या खा. भरपूर पाणी प्या. योग आणि ध्यान मनासाठी खूप फायदेशीर आहे. जंक फूड टाळा आणि शरीर सक्रिय ठेवा. निरोगी राहिल्यास आपण जीवनाचा पूर्ण आनंद घेऊ शकतो.",

  "शिक्षण हे जीवनाचे मूलभूत अधिकार आहे. शिक्षणामुळे आपण स्वतःचा आणि समाजाचा विकास करू शकतो. दररोज नवीन काहीतरी शिकण्याचा प्रयत्न करा. संगणक टायपिंग आजच्या काळात एक महत्त्वाची कौशल्य आहे जी नोकरीत खूप उपयुक्त ठरते. नियमित सरावाने थोड्याच दिवसांत टायपिंगची गती वाढवता येते.",
];

const MARATHI_MEDIUM = [
  "महाराष्ट्र शासनाच्या विविध विभागांमध्ये मराठी आणि इंग्रजी टायपिंग हे एक अनिवार्य कौशल्य आहे. शासकीय परीक्षांमध्ये ठरावीक गती आणि अचूकतेने टायपिंग करण्याची क्षमता सिद्ध करावी लागते. दैनंदिन सराव आणि योग्य बोटांची स्थिती शिकल्यास काही आठवड्यांमध्येच टायपिंगमध्ये लक्षणीय सुधारणा होते. न्यायालयीन आणि प्रशासकीय दस्तावेजांमध्ये अचूकता खूप महत्त्वाची असते.",
];

// ─── French ────────────────────────────────────────────────
const FRENCH_EASY = [
  "La France est un pays magnifique situé en Europe occidentale. Elle est célèbre pour sa gastronomie, sa culture, son art et son architecture. Paris, la capitale, est l'une des villes les plus visitées au monde. La tour Eiffel, le Louvre et Notre-Dame de Paris sont des monuments emblématiques connus dans le monde entier. La langue française est parlée par des millions de personnes sur tous les continents et est considérée comme une langue de la diplomatie et de la culture.",

  "Apprendre à taper rapidement et avec précision est une compétence précieuse dans le monde moderne. Avec les ordinateurs utilisés dans presque tous les domaines professionnels, une bonne maîtrise de la frappe au clavier vous permet de travailler plus efficacement. La méthode correcte consiste à placer vos doigts sur les touches de base et à utiliser tous vos doigts. Une pratique régulière de trente minutes par jour peut doubler votre vitesse de frappe en quelques mois.",

  "La santé est le bien le plus précieux que nous ayons. Pour rester en bonne santé, il faut manger équilibré, faire de l'exercice régulièrement et dormir suffisamment. Consommez beaucoup de fruits et légumes frais et buvez au moins deux litres d'eau par jour. Évitez la malbouffe et les boissons sucrées. Le yoga et la méditation sont excellents pour la santé mentale et aident à réduire le stress quotidien. Une bonne hygiène de vie est la clé d'une vie longue et épanouie.",
];

const FRENCH_MEDIUM = [
  "Dans le contexte de la transformation numérique accélérée que connaissent toutes les économies mondiales, la maîtrise des outils informatiques et notamment de la frappe au clavier est devenue une compétence fondamentale pour tout professionnel. Les employeurs recherchent des candidats capables de produire des documents de qualité rapidement et sans fautes. La pratique régulière, associée à une méthode rigoureuse d'apprentissage du placement des doigts, permet d'atteindre des vitesses de frappe remarquables tout en maintenant un taux d'erreur minimal.",

  "La République française est fondée sur les principes de liberté, d'égalité et de fraternité inscrits dans sa Constitution. Le système éducatif français est réputé dans le monde entier pour son exigence et sa rigueur intellectuelle. La France a produit de nombreux philosophes, écrivains, scientifiques et artistes qui ont marqué l'histoire de l'humanité. Son système de protection sociale, bien que soumis à des pressions budgétaires croissantes, reste l'un des plus complets d'Europe.",
];

// ─── German ────────────────────────────────────────────────
const GERMAN_EASY = [
  "Deutschland ist ein großes und wichtiges Land in Mitteleuropa. Es ist bekannt für seine Industrie, Technologie, Musik und Literatur. Berlin ist die Hauptstadt und eine der lebendigsten Städte Europas. Die deutsche Sprache wird von über neunzig Millionen Menschen als Muttersprache gesprochen. Deutschland hat viele berühmte Philosophen, Komponisten und Wissenschaftler hervorgebracht, die die Weltgeschichte geprägt haben.",

  "Das Erlernen des Zehnfingersystems ist eine der wertvollsten Fähigkeiten in der modernen Arbeitswelt. Mit regelmäßigem Training von mindestens dreißig Minuten täglich kann jeder seine Tippgeschwindigkeit deutlich steigern. Die richtige Fingerhaltung auf den Grundtasten ist dabei entscheidend. Fehlerfreies und schnelles Schreiben ist in vielen Berufen unverzichtbar und kann die Produktivität erheblich steigern.",

  "Gesundheit ist unser wertvollstes Gut. Um gesund zu bleiben, sollte man regelmäßig Sport treiben, ausgewogen essen und ausreichend schlafen. Frisches Obst und Gemüse sowie viel Wasser sind wichtig für die körperliche Gesundheit. Stress sollte durch Entspannungstechniken wie Meditation oder Yoga abgebaut werden. Regelmäßige Vorsorgeuntersuchungen beim Arzt helfen dabei, Krankheiten frühzeitig zu erkennen und zu behandeln.",
];

const GERMAN_MEDIUM = [
  "Die digitale Transformation hat in den vergangenen Jahren nahezu alle Bereiche des Wirtschafts- und Gesellschaftslebens grundlegend verändert. Effizientes Arbeiten mit dem Computer erfordert nicht nur Fachkenntnisse, sondern auch handwerkliche Fertigkeiten wie das schnelle und fehlerfreie Schreiben auf der Tastatur. In Behörden, Unternehmen und akademischen Einrichtungen wird von Mitarbeitenden erwartet, dass sie Texte flüssig und korrekt erstellen können. Die Investition in professionelle Schreibfertigkeiten zahlt sich langfristig durch erhöhte Produktivität und bessere Qualität der Arbeitsergebnisse aus.",
];

// ─── Spanish ───────────────────────────────────────────────
const SPANISH_EASY = [
  "España es un país hermoso situado en el suroeste de Europa. Es famoso por su cultura rica, su historia fascinante, su gastronomía deliciosa y su gente cálida y hospitalaria. Madrid es la capital y la ciudad más grande del país. El idioma español es hablado por más de quinientos millones de personas en todo el mundo, lo que lo convierte en el segundo idioma más hablado como lengua nativa después del chino mandarín.",

  "Aprender a escribir con todos los dedos en el teclado es una habilidad muy valiosa en el mundo laboral moderno. Con práctica regular de al menos treinta minutos al día, cualquier persona puede mejorar significativamente su velocidad y precisión de escritura. La colocación correcta de los dedos en la fila base es fundamental para desarrollar una técnica eficiente. Ser un mecanógrafo rápido y preciso puede marcar una gran diferencia en tu productividad profesional.",

  "La salud es el bien más preciado que tenemos. Para mantener una buena salud, es fundamental seguir una dieta equilibrada rica en frutas, verduras, proteínas y cereales integrales. El ejercicio físico regular, como caminar, nadar o practicar yoga, mantiene el cuerpo en forma y la mente despejada. Dormir entre siete y ocho horas cada noche es igualmente importante para la recuperación física y mental. Beber suficiente agua a lo largo del día y evitar el alcohol y el tabaco son hábitos esenciales.",
];

const SPANISH_MEDIUM = [
  "En la era digital en la que vivimos, el dominio de las herramientas informáticas y especialmente de la mecanografía se ha convertido en una competencia esencial para cualquier profesional. Los empleadores valoran enormemente a los candidatos que pueden producir documentos con rapidez y precisión. La práctica sistemática con textos variados, combinada con el aprendizaje correcto de la posición de los dedos sobre el teclado, permite alcanzar velocidades de escritura notables sin sacrificar la exactitud. Los exámenes de mecanografía para puestos de funcionario público requieren mantener un mínimo de cuarenta palabras por minuto con una precisión del noventa y cinco por ciento.",

  "La Constitución española de mil novecientos setenta y ocho establece un Estado social y democrático de Derecho que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político. El sistema parlamentario español está compuesto por el Congreso de los Diputados y el Senado, que forman las Cortes Generales. La monarquía parlamentaria combina la figura del rey como jefe de Estado con un gobierno elegido democráticamente por la ciudadanía.",
];

// ─── Pool builder ──────────────────────────────────────────
function buildPool(easy: string[], medium: string[], hard: string[]): Record<number, string[]> {
  const pool: Record<number, string[]> = {};
  for (let lvl = 1; lvl <= 150; lvl++) {
    if (lvl <= 30) pool[lvl] = easy;
    else if (lvl <= 90) pool[lvl] = medium.length > 0 ? medium : easy;
    else pool[lvl] = hard.length > 0 ? hard : (medium.length > 0 ? medium : easy);
  }
  return pool;
}

const POOLS: Record<Language, Record<number, string[]>> = {
  english: buildPool(ENGLISH_EASY, ENGLISH_MEDIUM, ENGLISH_HARD),
  hindi:   buildPool(HINDI_EASY,   HINDI_MEDIUM,   HINDI_HARD),
  urdu:    buildPool(URDU_EASY,    URDU_MEDIUM,    URDU_MEDIUM),
  arabic:  buildPool(ARABIC_EASY,  ARABIC_MEDIUM,  ARABIC_MEDIUM),
  bengali: buildPool(BENGALI_EASY, BENGALI_MEDIUM, BENGALI_MEDIUM),
  tamil:   buildPool(TAMIL_EASY,   TAMIL_MEDIUM,   TAMIL_MEDIUM),
  marathi: buildPool(MARATHI_EASY, MARATHI_MEDIUM, MARATHI_MEDIUM),
  french:  buildPool(FRENCH_EASY,  FRENCH_MEDIUM,  FRENCH_MEDIUM),
  german:  buildPool(GERMAN_EASY,  GERMAN_MEDIUM,  GERMAN_MEDIUM),
  spanish: buildPool(SPANISH_EASY, SPANISH_MEDIUM, SPANISH_MEDIUM),
};

export function getRandomParagraph(language: Language, level: number): string {
  const pool = POOLS[language] ?? POOLS.english;
  const paragraphs = pool[Math.min(Math.max(level, 1), 150)] ?? ENGLISH_EASY;
  const usedKey = `jktm_used_${language}_${level}`;
  const used: number[] = JSON.parse(localStorage.getItem(usedKey) ?? "[]");
  const available = paragraphs.map((_, i) => i).filter(i => !used.includes(i));
  let idx: number;
  if (available.length === 0) {
    localStorage.setItem(usedKey, "[]");
    idx = Math.floor(Math.random() * paragraphs.length);
  } else {
    idx = available[Math.floor(Math.random() * available.length)];
    const newUsed = [...used, idx].slice(-paragraphs.length);
    localStorage.setItem(usedKey, JSON.stringify(newUsed));
  }
  return paragraphs[idx];
}

/**
 * Returns a long passage by chaining multiple unique paragraphs together.
 * Beginner (1-30): 3 paragraphs, Intermediate (31-90): 5 paragraphs,
 * Advanced (91-150): 7 paragraphs — giving 300-1400+ words per session.
 */
export function getExtendedPassage(language: Language, level: number): string {
  const count = level <= 30 ? 3 : level <= 60 ? 4 : level <= 90 ? 5 : level <= 120 ? 6 : 7;
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    parts.push(getRandomParagraph(language, level));
  }
  return parts.join("  ");
}

export function getLevelLabel(level: number): string {
  if (level <= 10) return "Beginner";
  if (level <= 30) return "Elementary";
  if (level <= 60) return "Intermediate";
  if (level <= 90) return "Upper-Intermediate";
  if (level <= 120) return "Advanced";
  return "Expert";
}

export function getLevelColor(level: number): string {
  if (level <= 30) return "bg-emerald-100 text-emerald-700";
  if (level <= 60) return "bg-blue-100 text-blue-700";
  if (level <= 90) return "bg-violet-100 text-violet-700";
  if (level <= 120) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

export function getCompletedLevels(language: Language): Set<number> {
  try {
    const arr: number[] = JSON.parse(localStorage.getItem(`jktm_levels_done_${language}`) ?? "[]");
    return new Set(arr);
  } catch { return new Set(); }
}

export function isLevelCompleted(language: Language, level: number): boolean {
  return getCompletedLevels(language).has(level);
}

export function getLevelProgress(language: Language): number {
  return getCompletedLevels(language).size;
}

export function setLevelProgress(language: Language, level: number) {
  const done = getCompletedLevels(language);
  done.add(level);
  localStorage.setItem(`jktm_levels_done_${language}`, JSON.stringify(Array.from(done)));
  // Legacy key kept for backward compat
  const legacyKey = `jktm_level_progress_${language}`;
  const legacyCurrent = Number(localStorage.getItem(legacyKey) ?? "0");
  if (level > legacyCurrent) localStorage.setItem(legacyKey, String(level));
}

export function getOfflineStats(): { totalSessions: number; totalWords: number; bestWpm: number } {
  return JSON.parse(localStorage.getItem("jktm_offline_stats") ?? '{"totalSessions":0,"totalWords":0,"bestWpm":0}');
}

export function saveOfflineSession(wpm: number, words: number) {
  const stats = getOfflineStats();
  stats.totalSessions++;
  stats.totalWords += words;
  stats.bestWpm = Math.max(stats.bestWpm, wpm);
  localStorage.setItem("jktm_offline_stats", JSON.stringify(stats));
}

// Typing mode
export type TypingMode = "guided" | "practice" | "expert" | "no-backspace" | "word-backspace" | "exam" | "strict";
export const TYPING_MODES: { id: TypingMode; label: string; desc: string; icon: string }[] = [
  { id: "guided",         label: "Guided",          desc: "Step-by-step key & finger instructions",          icon: "🎓" },
  { id: "practice",       label: "Practice",        desc: "Keyboard shown, no key prompts",                  icon: "📝" },
  { id: "expert",         label: "Expert",          desc: "No guidance — pure typing speed",                 icon: "⚡" },
  { id: "no-backspace",   label: "No Backspace",    desc: "Cannot delete — every key counts",                icon: "🚫" },
  { id: "word-backspace", label: "Word Backspace",  desc: "Backspace only within current word",              icon: "↩️" },
  { id: "exam",           label: "Exam Mode",       desc: "No hints, no backspace, timed — exam simulation", icon: "📋" },
  { id: "strict",         label: "Strict",          desc: "Typing stops when 2+ errors — fix or fail",       icon: "🎯" },
];

// Game word lists per language
export const GAME_WORDS: Partial<Record<Language, string[]>> = {
  english: ["the","quick","brown","fox","jumps","over","lazy","dog","type","fast","key","board","speed","test","skill","learn","press","enter","shift","space","finger","home","row","text","word","line","mark","rate","goal","win"],
  hindi:   ["आज","काम","नाम","घर","पानी","खाना","किताब","स्कूल","पढ़ना","लिखना","सीखना","अभ्यास","गति","सटीकता","कंप्यूटर","टाइपिंग","मेहनत","सफलता"],
  urdu:    ["آج","کام","نام","گھر","پانی","کھانا","کتاب","اسکول","پڑھنا","لکھنا","سیکھنا","مشق","رفتار","درستگی","کمپیوٹر","ٹائپنگ","محنت","کامیابی"],
  french:  ["bonjour","merci","rapide","clavier","vitesse","précision","apprendre","pratiquer","doigt","touche","texte","mot","ligne","score","objectif"],
  german:  ["schnell","Tastatur","Übung","lernen","Finger","Taste","Text","Wort","Geschwindigkeit","Genauigkeit","Ziel","Erfolg"],
  spanish: ["rápido","teclado","velocidad","precisión","aprender","practicar","dedo","tecla","texto","palabra","línea","objetivo","éxito"],
};
