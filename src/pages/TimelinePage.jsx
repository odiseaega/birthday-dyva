import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [visibleItems, setVisibleItems] = useState([]);

  // Data timeline - Anda bisa edit sesuai cerita kalian
  const timelineData = [
    {
      id: 1,
      date: '31 Agustus 2022',
      title: 'Kita Pacaran Yeyyyy',
      description: 'Waktu itu aku nembak kamu di MUPAT, tepatnya di depan parkiran, aku kasih kamu kalung buat pertanda kamu sekarang jadi pacarnya aku, pas itu kita banyak foto foto bareng pakai kebaya lucuuu sukaaaa ',
      emoji: '🥳🥳🥳🥳🥳'
    },
    {
      id: 2,
      date: '11 September 2022',
      title: 'Pergi main sama kamu',
      description: 'Pas itu kita pergi main seharian, jalan jalan, terus kita main timezone di amplazz berduaa, kita adu mainn sodok bolaa tuu awokawokowk, masih ingattt jelas dengan skor 2:7 jirlahh, trus trus kita photoboxx hehehe senengg bangetttt, habis main sama photobox kita makan di kfc juga waktu itu, truss truss kita jalan jalann dehh sekalian pulangg',
      emoji: '👩🏼‍🤝‍👨🏽👩🏼‍🤝‍👨🏽👩🏼‍🤝‍👨🏽👩🏼‍🤝‍👨🏽👩🏼‍🤝‍👨🏽'
    },
    {
      id: 3,
      date: '09 Oktober 2022',
      title: 'Pergi ke alun alun and nightride wit yuuu',
      description: 'Aku gakan lupa sama yg setiap ke alun alun pasti di suruh naik kora kora, sumpahhh hal gilaa nek ituu yaaa gakan lagii naik kora kora gituan lagiii, tapii gapapa siii tetep senengg kokk xixixi, pas mau keluar alun alun kita kehujanan terus ketemu orang cosplay pocong ahaahhahaa, pas hujan nya berhenti kita jalan jalan sampe puasss ahhh pokoknya senengg bangett happiyyy',
      emoji: '🏍️👩🏻‍❤️‍👨🏻🏍️👩🏻‍❤️‍👨🏻'
    },
    {
      id: 4,
      date: '13 November 2022',
      title: 'Kita berdua suncity',
      description: 'Bangun pagi cuma mau suncity di kfc sudirman, kita keliling rute buat ambil banyak banyak foto, punya foto foto bagus berdua di atas motorr, tapi sekarang dah gak suncity an kitaaa :(((',
      emoji: '🏍️🏍️🏍️🏍️'
    },
    {
      id: 5,
      date: '03 Desember 2023',
      title: 'Ke SCH main Boulder',
      description: 'Main trampolin secapee ituu, yang kukira 1 jam itu bentar, beberapa menit doang aja dah cape bangettt, tapi capee nya terbayarkann soale main e sama kamu, trus truss ada adek adek tu kenalan trus ngajakin kita berdua main barenggg ehh pas main game e tu yg jatuh kalah aku di suruh ngalahh ahahahaahah ngakakkk seruuuu ',
      emoji: '🤾🏻‍♂️⛹🏻‍♀️🥇🥈'
    },
    {
      id: 6,
      date: '22 Desember 2022',
      title: 'Pertama kali di buatin web sama kamu',
      description: 'Sumpahh yaa itu pertama kali aku di bikinin web sama kamu, rasanya senenggg nya pake bangett ngettt, kamu se effort itu bikinin aku web buat hari ulang tahun ku, tapii sekarang gantian aku yang bikin yaaa, walaupun gak begitu bagus tapi ini usaha akuuuu hehehee',
      emoji: '💻💻💻💻'
    },
    {
      id: 7,
      date: '18 Maret 2023',
      title: 'Main ke pantai Kulon Progo',
      description: 'Kita awal awal berangkat siang an kehujanan, terus kita lanjutin aja dehh perjalanan nyaa, pas sampai di pantai kita seru seruan berdua tuu, jujurr bangett seruu asikk kalau main berdua samaa kamuuu, cape cape dijalan nya jadi hilangg pas seru seruan di pantai sama kamu, main pasir trus gendong gendongann aduhhh pokoknyaaa seruuu pollll kokkkk',
      emoji: '🏖️⛱️🏝️⛱️'
    },
    {
      id: 8,
      date: '21 Maret 2023',
      title: 'Ulang Tahun Kamu',
      description: 'Pertama kali aku rayain ulang tahun kamu selama kita dah pacaran hehehe, aku ngasih kamu buket makanan sama hadiah hadiah buat kamuu, maap yahh waktu itu cuma bisa ngasi kejutan ituu, fyi juga itukan suprise kan yak dan sudah di rencanakan awokawowkaok',
      emoji: '🎉🎂🎂🎉'
    },
    {
      id: 9,
      date: '02 April 2023',
      title: 'Acara motor fazio',
      description: 'Ahahahahaha ini sih acara yg di adain yamaha, kita di ajakin farid buat ikut event motoran pakai fazio ituu, seru bangett dijalan e, pas kehujanan mampir ke pom bensin tu arah kaliurang beli jas hujan, asemmm beli apa di kasih lupa tu pokoknya jas hujan mu ukurannya gede, trus kamu kelihatan jadi seperti bocill sd awokwowowkwk, trus truss pulang e kita nonton bioskopp dehhh di pakuwon',
      emoji: '🛵🛵🛵🛵'
    },
    {
      id: 10,
      date: '19 Mei 2023',
      title: 'Dipaa Wisudaa',
      description: 'Kamu hari itu wisuda kelulusan dari MUPAT, ikutann senenggg, bahkan kita banyak banyak foto pas di hari kamu wisudaa tuu, kamuu berpenampilan full makeup cantikkkk, tapi aku liat e kayak bukan dipaaa asemmm kayak orang lainnn awokwokwoko maappp yhh sayanggg',
      emoji: '🎓🎓🎓🎓'
    },
    {
      id: 11,
      date: '26 Agustus 2023',
      title: 'Bikin lukisan tangan bareng',
      description: 'Waktu tu kita pergi ke pantai yang jauhh, trus kita bikin lukisan tangan berdua, pakai cat warna akrilik hahahaha sampe bercanda canda kena celana jugaa, itu momen dah 2 tahun yaaa gak kerasaaa, sedihhh mau kek gitu lagiii, tapi disitu aku happy bangetttt bisa bikin sesuatu yang kita bikin sendiri secara langsung pula',
      emoji: '🎨🎨🎨🎨'
    },
    {
      id: 12,
      date: '02 Desember 2023',
      title: 'Pergi Glamping Bareng Keluargaku',
      description: 'Jujurrr niii yaa yanggg aku nii senenggg bangetttt, karena cuma kamu dann baru kamau doang yang bener bener deket sama keluargaku, makanya aku gamau sia sia inn, bener bener ndak mau kamu di gantikannn hehehe, maap yhh dikk aku kadang bikin kamuu kesell xixixi',
      emoji: '🏕️🏕️🏕️🏕️'
    },
    {
      id: 13,
      date: '09 Juni 2024',
      title: 'Motoran Ke Telomoyo',
      description: 'Hari dimana kita ngejar lautan awan ke telomoyo, berangkat pagi pagi bangett biar disana dapet lautan awan nya dann yapp dapatt lautan awan nyaa, gak sia sia kesana nyaa jadi terbayarkann, pengen lagi pergi jauh berdua bareng sama kamu berdua gituu sayanggg, agendakan lagi yahhh lopyuuu',
      emoji: '🏍️⛰️🏍️⛰️'
    },
    {
      id: 14,
      date: '22 Desember 2024',
      title: 'Trip to Semarang',
      description: 'Pas kita kita trip ke semarang ni aku seneng bangett, bisa ngerayain ulang tahun ku enggak di jogja tapi di beda kota, terlebih lagi di temani kamuu, senengg bangett rasanya pengen lagii kita pergi pergi jauhh lagii',
      emoji: '🚙🎡🚙🎠'
    },
    {
      id: 15,
      date: '27 Agustus 2025',
      title: 'Trip to Jawa Timur',
      description: 'Pergi luar kota terakhir kita di jawa timur, senengg bangettt di sana bisa bener bener menikmati walaupun cuma berempatt yaaa, apalagi pas di jatim park1 wahh itu seru bangetttt aku pengen lagi ngulangi masa ituuu, bener bener wah petcahhhh seru polll, ayooo yaaaa yangg kalau ega ada rejekii kita pergi lagiii mwahhhh',
      emoji: '🎡🚘🏰🚘'
    },
  ];

  // Animasi saat scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.dataset.id);
            setVisibleItems((prev) => [...new Set([...prev, id])]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.timeline-item');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Our Journey Together
          </h1>
          <p className="text-gray-600 text-lg">
            Terima kasih buat kamu yang selama ini udah bertahan sampai sekarang yaa🫶🏻🫶🏻
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-pink-300 to-blue-300 transform md:-translate-x-1/2"></div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <div
                key={item.id}
                data-id={item.id}
                className={`timeline-item relative ${
                  index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'
                } transition-all duration-700 ${
                  visibleItems.includes(item.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Dot */}
                <div className={`absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 ${
                  visibleItems.includes(item.id) ? 'scale-100' : 'scale-0'
                } transition-transform duration-500`}></div>

                {/* Content Card */}
                <div className={`ml-20 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}>
                  <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border border-purple-100">
                    {/* Emoji */}
                    <div className="text-5xl mb-4">{item.emoji}</div>
                    
                    {/* Date */}
                    <div className="inline-block px-4 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-3">
                      <span className="text-sm font-semibold text-purple-700">
                        📅 {item.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-16 p-8 bg-white rounded-2xl shadow-lg border border-purple-100">
          <div className="text-4xl mb-4">💝</div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
            Perjalanan ini masih sangat sangat panjang, jadi kita jalani semua sama sama yaa...
          </h3>
          <p className="text-gray-600">
            Makasih banyak yaa buat kamu udah jadi bagian terpenting di hidup aku, kamu juga udah banyak mengajariku banyak hal hal yang gak aku tau jadi tau...
            <br />
            I love you, Dyva! 💖
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;