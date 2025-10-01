import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, MapPin, Phone, Calendar, Award, Code2, Briefcase, GraduationCap, Star, Trophy, Zap } from 'lucide-react';

const MarioProfile = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [marioPos, setMarioPos] = useState({ x: 50, y: 400 });
  const [isJumping, setIsJumping] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState('right');
  const [coins, setCoins] = useState(0);
  const [lives, setLives] = useState(3);
  const [powerUp, setPowerUp] = useState('small'); // small, big, fire
  const [collectedItems, setCollectedItems] = useState(new Set());
  const [showModal, setShowModal] = useState(null);
  const [keys, setKeys] = useState({});
  const [enemies, setEnemies] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  
  const GRAVITY = 0.6;
  const JUMP_POWER = -15;
  const MOVE_SPEED = 5;
  const GROUND = 400;
  const MARIO_SIZE = 40;

  const levels = [
    {
      name: 'World 1-1: Introduction',
      theme: 'from-blue-400 to-blue-300',
      boxes: [
        { id: 'intro1', x: 200, y: 250, type: 'question', content: 'profile' },
        { id: 'intro2', x: 350, y: 250, type: 'question', content: 'objective' },
        { id: 'intro3', x: 500, y: 200, type: 'brick' },
        { id: 'intro4', x: 550, y: 200, type: 'brick' },
      ],
      coins: [
        { id: 'c1', x: 300, y: 300 },
        { id: 'c2', x: 450, y: 300 },
      ],
      pipes: [
        { x: 650, y: 350, height: 90 }
      ],
      enemies: [
        { id: 'e1', startX: 400, y: 410, direction: 1 }
      ]
    },
    {
      name: 'World 1-2: Skills & Education',
      theme: 'from-purple-400 to-purple-300',
      boxes: [
        { id: 'skill1', x: 180, y: 250, type: 'question', content: 'skills' },
        { id: 'skill2', x: 280, y: 200, type: 'question', content: 'education' },
        { id: 'skill3', x: 400, y: 250, type: 'power', content: 'powerup' },
        { id: 'skill4', x: 550, y: 200, type: 'brick' },
        { id: 'skill5', x: 600, y: 200, type: 'brick' },
      ],
      coins: [
        { id: 'c3', x: 230, y: 280 },
        { id: 'c4', x: 350, y: 250 },
        { id: 'c5', x: 500, y: 280 },
      ],
      pipes: [
        { x: 700, y: 350, height: 90 }
      ],
      enemies: [
        { id: 'e2', startX: 350, y: 410, direction: -1 },
        { id: 'e3', startX: 600, y: 410, direction: 1 }
      ]
    },
    {
      name: 'World 1-3: Experience',
      theme: 'from-green-400 to-green-300',
      boxes: [
        { id: 'exp1', x: 200, y: 220, type: 'question', content: 'project1' },
        { id: 'exp2', x: 350, y: 220, type: 'question', content: 'project2' },
        { id: 'exp3', x: 500, y: 220, type: 'brick' },
        { id: 'exp4', x: 550, y: 180, type: 'brick' },
        { id: 'exp5', x: 600, y: 180, type: 'brick' },
      ],
      coins: [
        { id: 'c6', x: 280, y: 270 },
        { id: 'c7', x: 425, y: 270 },
        { id: 'c8', x: 575, y: 230 },
      ],
      pipes: [
        { x: 150, y: 380, height: 60 },
        { x: 680, y: 350, height: 90 }
      ],
      enemies: [
        { id: 'e4', startX: 300, y: 410, direction: 1 },
        { id: 'e5', startX: 550, y: 410, direction: -1 }
      ]
    },
    {
      name: 'World 1-4: Contact & Connect',
      theme: 'from-orange-400 to-red-400',
      boxes: [
        { id: 'contact1', x: 250, y: 200, type: 'question', content: 'contact' },
        { id: 'contact2', x: 400, y: 200, type: 'question', content: 'social' },
        { id: 'contact3', x: 550, y: 200, type: 'star', content: 'finale' },
      ],
      coins: [
        { id: 'c9', x: 200, y: 250 },
        { id: 'c10', x: 325, y: 250 },
        { id: 'c11', x: 475, y: 250 },
        { id: 'c12', x: 625, y: 250 },
      ],
      pipes: [
        { x: 650, y: 320, height: 120 }
      ],
      enemies: [
        { id: 'e6', startX: 200, y: 410, direction: 1 },
        { id: 'e7', startX: 500, y: 410, direction: -1 }
      ]
    }
  ];

  const contents = {
    profile: {
      title: '👤 Phạm Đức Long',
      subtitle: 'Intern Java Developer',
      text: '🎂 Ngày sinh: 09/10/2005\n📍 Bát Khối, Long Biên, Hà Nội\n\nTôi là một sinh viên đam mê lập trình, đặc biệt là Java Backend Development. Hiện đang học tại FPT Polytechnic với GPA 3.8/4.0.',
      color: 'from-blue-500 to-cyan-500',
      icon: '👨‍💻'
    },
    objective: {
      title: '🎯 Mục Tiêu Nghề Nghiệp',
      subtitle: 'Career Objective',
      text: 'Tôi đang tìm kiếm vị trí Intern Java Backend Developer để áp dụng kiến thức về Java và Spring Boot vào các dự án thực tế.\n\nMục tiêu dài hạn là trở thành một Senior Backend Developer với kỹ năng thiết kế hệ thống vững chắc và kinh nghiệm trong việc xây dựng các ứng dụng web có khả năng mở rộng, bảo mật và hiệu suất cao.',
      color: 'from-yellow-500 to-orange-500',
      icon: '🎯'
    },
    skills: {
      title: '⚡ Kỹ Năng Chuyên Môn',
      subtitle: 'Technical Skills',
      text: '💻 Front-end:\n• HTML, CSS, Bootstrap\n• JavaScript, ReactJS\n\n☕ Back-end:\n• Java Core, Spring Boot\n• Spring Security, Spring Data JPA\n\n🗄️ Database:\n• SQL Server, MySQL\n\n🛠️ Tools:\n• IntelliJ IDEA, VS Code\n• Postman, Git/GitHub',
      color: 'from-purple-500 to-pink-500',
      icon: '⚡'
    },
    education: {
      title: '🎓 Học Vấn',
      subtitle: 'Education',
      text: '🏫 FPT Polytechnic College\n📚 Chuyên ngành: Software Development\n📊 GPA: 3.8/4.0\n📅 2023 - 2025\n\n✨ Soft Skills:\n• Đọc và hiểu tiếng Anh\n• Hòa đồng, thân thiện\n• Nhiệt tình, ham học hỏi',
      color: 'from-green-500 to-teal-500',
      icon: '🎓'
    },
    project1: {
      title: '🚀 Article Management Website',
      subtitle: 'Full Stack Developer (09/2024 - 11/2024)',
      text: '🔧 Technologies: ReactJS, Spring Boot, SQL Server\n\n📋 Mô tả:\nXây dựng website quản lý bài viết sử dụng ReactJS, Spring Boot và SQL Server, cho phép xử lý bài viết hiệu quả và điều phối công việc giữa các phòng ban.\n\n✨ Tính năng chính:\n• Quản lý bài viết: Tạo, sửa, xóa bài viết\n• Quản lý từ khóa: Chủ đề cố định hoặc tùy chỉnh\n• Quản lý đăng ký sinh viên: Đăng ký và quản lý\n• Quản lý phân công: Giao nhiệm vụ cho nhân viên\n\n🔗 GitHub: github.com/dnclou6/Article-Management',
      color: 'from-blue-500 to-purple-500',
      icon: '📝'
    },
    project2: {
      title: '🛍️ Clothing Store Manager',
      subtitle: 'Full Stack Developer (04/2025 - 09/2025)',
      text: '🔧 Technologies: JavaScript, Thymeleaf, Spring Boot, SQL Server\n\n📋 Mô tả:\nPhát triển ứng dụng quản lý cửa hàng thời trang sử dụng JavaScript, Thymeleaf, Spring Boot và SQL Server.\n\n✨ Tính năng chính:\n• Quản lý sản phẩm: Thêm, sửa, xóa sản phẩm\n• Quản lý danh mục: Phân loại thời trang\n• Quản lý khách hàng: Lịch sử mua hàng\n• Quản lý người dùng: Phân quyền admin/staff\n• Theo dõi tồn kho: Cảnh báo tồn kho\n• Báo cáo: Doanh thu và hiệu suất\n• Tích hợp Chatbot: Hỗ trợ khách hàng',
      color: 'from-pink-500 to-red-500',
      icon: '👔'
    },
    contact: {
      title: '📬 Liên Hệ Với Tôi',
      subtitle: 'Get In Touch',
      text: '📧 Email: phdlong2006@gmail.com\n📱 Phone: 0911 006 045\n📍 Address: Bát Khối, Long Biên, Hà Nội\n\nHãy kết nối với tôi qua các kênh bên dưới! Tôi luôn sẵn sàng thảo luận về công nghệ, dự án và cơ hội hợp tác.',
      color: 'from-green-500 to-emerald-500',
      icon: '📞'
    },
    social: {
      title: '🌐 Mạng Xã Hội',
      subtitle: 'Social Networks',
      text: '🐙 GitHub: github.com/dnclou6\n💼 LinkedIn: linkedin.com/in/dnclou6\n🌐 Portfolio: duolong-profile.vercel.app\n\nKhám phá các dự án của tôi trên GitHub và kết nối với tôi trên LinkedIn!',
      color: 'from-blue-500 to-indigo-500',
      icon: '🔗'
    },
    finale: {
      title: '🌟 Cảm Ơn Bạn!',
      subtitle: 'Thank You For Visiting',
      text: '🎉 Chúc mừng! Bạn đã hoàn thành tất cả các màn!\n\n💼 Tôi rất mong được làm việc cùng bạn và đóng góp vào sự phát triển của công ty.\n\n✨ Hãy liên hệ với tôi để thảo luận thêm về các cơ hội hợp tác!\n\n🚀 Let\'s build something amazing together!',
      color: 'from-yellow-400 to-orange-500',
      icon: '⭐'
    },
    powerup: {
      title: '🍄 Power Up!',
      subtitle: 'Level Up Your Skills',
      text: 'Mario đã lớn lên! Tương tự, tôi luôn không ngừng học hỏi và phát triển kỹ năng của mình.\n\n📈 Tôi tin vào việc học tập liên tục và cải thiện bản thân mỗi ngày!',
      color: 'from-red-500 to-orange-500',
      icon: '🍄'
    }
  };

  useEffect(() => {
    if (gameStarted) {
      const level = levels[currentLevel];
      setEnemies(level.enemies.map(e => ({ ...e, x: e.startX })));
      setMarioPos({ x: 50, y: 400 });
      setLevelComplete(false);
    }
  }, [currentLevel, gameStarted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) {
        if (e.key === ' ' || e.key === 'Enter') {
          setGameStarted(true);
        }
        return;
      }

      setKeys(prev => ({ ...prev, [e.key]: true }));
      
      if (e.key === ' ' && !isJumping && marioPos.y >= GROUND) {
        setIsJumping(true);
        setVelocity(JUMP_POWER);
      }
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, marioPos.y, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      // Move enemies
      setEnemies(prev => prev.map(enemy => {
        let newX = enemy.x + enemy.direction * 2;
        let newDir = enemy.direction;
        
        if (newX < 50 || newX > 750) {
          newDir = -enemy.direction;
          newX = enemy.x + newDir * 2;
        }
        
        return { ...enemy, x: newX, direction: newDir };
      }));

      setMarioPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelocity = velocity;

        if (keys['ArrowLeft'] || keys['a']) {
          newX = Math.max(20, prev.x - MOVE_SPEED);
          setDirection('left');
        }
        if (keys['ArrowRight'] || keys['d']) {
          newX = Math.min(760, prev.x + MOVE_SPEED);
          setDirection('right');
        }

        if (isJumping || newY < GROUND) {
          newVelocity += GRAVITY;
          newY += newVelocity;

          if (newY >= GROUND) {
            newY = GROUND;
            setIsJumping(false);
            setVelocity(0);
          } else {
            setVelocity(newVelocity);
          }
        }

        const level = levels[currentLevel];
        
        // Check box collision
        level.boxes.forEach(box => {
          const boxBottom = box.y + 40;
          const marioTop = newY;
          const marioLeft = newX;
          const marioRight = newX + MARIO_SIZE;
          const boxLeft = box.x;
          const boxRight = box.x + 40;

          if (
            marioTop <= boxBottom &&
            marioTop >= box.y - 10 &&
            marioRight > boxLeft &&
            marioLeft < boxRight &&
            newVelocity < 0
          ) {
            if (!collectedItems.has(box.id)) {
              setCollectedItems(prev => new Set([...prev, box.id]));
              if (box.content === 'powerup') {
                setPowerUp('big');
                setShowModal(box.content);
              } else if (box.content) {
                setShowModal(box.content);
              }
              if (box.type !== 'brick') {
                setCoins(c => c + 10);
              }
            }
            setVelocity(2);
          }
        });

        // Check coin collision
        level.coins.forEach(coin => {
          if (!collectedItems.has(coin.id)) {
            const dist = Math.sqrt((newX - coin.x) ** 2 + (newY - coin.y) ** 2);
            if (dist < 30) {
              setCollectedItems(prev => new Set([...prev, coin.id]));
              setCoins(c => c + 1);
            }
          }
        });

        // Check flag/end collision
        if (newX > 700 && currentLevel < levels.length - 1) {
          setLevelComplete(true);
        }

        // Check enemy collision
        enemies.forEach(enemy => {
          const dist = Math.sqrt((newX - enemy.x) ** 2 + (newY - enemy.y) ** 2);
          if (dist < 35) {
            if (newVelocity > 0 && newY < enemy.y - 10) {
              // Jump on enemy
              setVelocity(-10);
            } else {
              // Hit by enemy
              if (powerUp === 'big') {
                setPowerUp('small');
              } else {
                setLives(l => l - 1);
                if (lives <= 1) {
                  setGameStarted(false);
                  setCurrentLevel(0);
                  setLives(3);
                  setCoins(0);
                  setCollectedItems(new Set());
                }
              }
            }
          }
        });

        return { x: newX, y: newY };
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [keys, isJumping, velocity, currentLevel, gameStarted, enemies, collectedItems, lives, powerUp]);

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(c => c + 1);
      setLevelComplete(false);
      setCollectedItems(new Set());
    }
  };

  if (!gameStarted) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute animate-pulse" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`
            }}>⭐</div>
          ))}
        </div>
        
        <div className="text-center z-10 bg-black bg-opacity-70 p-12 rounded-3xl border-8 border-yellow-400">
          <h1 className="text-7xl font-bold text-white mb-6 animate-bounce" style={{
            textShadow: '6px 6px 0 #000, -3px -3px 0 #000',
            fontFamily: 'Arial Black'
          }}>
            SUPER MARIO
          </h1>
          <h2 className="text-5xl font-bold text-yellow-400 mb-8" style={{
            textShadow: '4px 4px 0 #000',
            fontFamily: 'Arial Black'
          }}>
            PORTFOLIO
          </h2>
          
          <div className="bg-white bg-opacity-90 p-6 rounded-2xl mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-5xl border-4 border-white shadow-lg">
                👨‍💻
              </div>
              <div className="text-left">
                <h3 className="text-3xl font-bold text-gray-800">Phạm Đức Long</h3>
                <p className="text-xl text-gray-600">Intern Java Developer</p>
              </div>
            </div>
          </div>

          <div className="text-white text-xl mb-8 space-y-2">
            <p className="flex items-center justify-center gap-2">
              <span className="text-3xl">🎮</span> 
              <span>Nhấn SPACE hoặc ENTER để bắt đầu!</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">← →</span> 
              <span>Di chuyển</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">⬆️</span> 
              <span>Nhảy</span>
            </p>
          </div>

          <div className="text-yellow-300 text-lg animate-pulse font-bold">
            🍄 Thu thập thông tin qua {levels.length} màn chơi! 🌟
          </div>
        </div>
      </div>
    );
  }

  const level = levels[currentLevel];

  return (
    <div className={`w-full h-screen bg-gradient-to-b ${level.theme} overflow-hidden relative`}>
      {/* HUD */}
      <div className="absolute top-4 left-0 right-0 z-30 px-8 flex justify-between items-center">
        <div className="flex gap-6">
          <div className="bg-black bg-opacity-70 px-6 py-3 rounded-full border-4 border-white">
            <span className="text-2xl font-bold text-white flex items-center gap-2">
              🪙 {coins}
            </span>
          </div>
          <div className="bg-black bg-opacity-70 px-6 py-3 rounded-full border-4 border-red-500">
            <span className="text-2xl font-bold text-white flex items-center gap-2">
              ❤️ x{lives}
            </span>
          </div>
          <div className="bg-black bg-opacity-70 px-6 py-3 rounded-full border-4 border-yellow-400">
            <span className="text-xl font-bold text-white">
              {level.name}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <a href="https://github.com/dnclou6" target="_blank" rel="noopener noreferrer"
            className="bg-gray-800 hover:bg-gray-900 p-3 rounded-full border-4 border-white hover:scale-110 transition-transform">
            <Github size={24} className="text-white" />
          </a>
          <a href="https://www.linkedin.com/in/dnclou6/" target="_blank" rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full border-4 border-white hover:scale-110 transition-transform">
            <Linkedin size={24} className="text-white" />
          </a>
        </div>
      </div>

      {/* Clouds */}
      <div className="absolute top-20 left-10 w-20 h-10 bg-white rounded-full opacity-80" style={{ boxShadow: '25px 0 0 white, 50px 0 0 white' }} />
      <div className="absolute top-40 right-40 w-20 h-10 bg-white rounded-full opacity-80" style={{ boxShadow: '25px 0 0 white, 50px 0 0 white' }} />

      {/* Boxes */}
      {level.boxes.map(box => (
        <div
          key={box.id}
          className={`absolute border-4 border-white transition-all duration-200 ${
            collectedItems.has(box.id) 
              ? 'bg-amber-800' 
              : box.type === 'question' ? 'bg-yellow-400'
              : box.type === 'brick' ? 'bg-orange-700'
              : box.type === 'power' ? 'bg-red-500'
              : box.type === 'star' ? 'bg-yellow-300'
              : 'bg-gray-600'
          }`}
          style={{
            left: box.x,
            top: box.y,
            width: 40,
            height: 40,
            boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
            transform: collectedItems.has(box.id) ? 'translateY(5px)' : 'none'
          }}
        >
          {!collectedItems.has(box.id) && (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold animate-pulse">
              {box.type === 'question' ? '?' : box.type === 'power' ? '🍄' : box.type === 'star' ? '⭐' : ''}
            </div>
          )}
        </div>
      ))}

      {/* Coins */}
      {level.coins.map(coin => !collectedItems.has(coin.id) && (
        <div
          key={coin.id}
          className="absolute text-3xl animate-bounce"
          style={{ left: coin.x, top: coin.y }}
        >
          🪙
        </div>
      ))}

      {/* Pipes */}
      {level.pipes.map((pipe, i) => (
        <div key={i} className="absolute" style={{ left: pipe.x, top: pipe.y }}>
          <div className="relative">
            <div className="w-16 h-8 bg-green-600 border-4 border-green-800 rounded-t-lg" style={{
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.3)'
            }} />
            <div className="w-14 bg-green-500 border-4 border-green-700 ml-1" style={{
              height: pipe.height,
              boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
      ))}

      {/* Enemies */}
      {enemies.map(enemy => (
        <div
          key={enemy.id}
          className="absolute"
          style={{ left: enemy.x, top: enemy.y, width: 30, height: 30 }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-orange-800 rounded-full border-2 border-orange-900" />
            <div className="absolute top-1 left-1 right-1 h-3 bg-orange-600 rounded-full" />
            <div className="absolute top-3 left-2 w-2 h-2 bg-white rounded-full border border-black" />
            <div className="absolute top-3 right-2 w-2 h-2 bg-white rounded-full border border-black" />
            <div className="absolute bottom-1 left-1 right-1 h-2 bg-orange-900 rounded" />
          </div>
        </div>
      ))}

      {/* Mario */}
      <div
        className="absolute transition-transform duration-100"
        style={{
          left: marioPos.x,
          top: marioPos.y,
          width: MARIO_SIZE,
          height: powerUp === 'big' ? MARIO_SIZE * 1.5 : MARIO_SIZE,
          transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-2 right-2 h-3 bg-red-600 rounded-t" />
          <div className="absolute top-3 left-1 right-1 h-4 bg-amber-600" />
          <div className="absolute top-4 left-2 w-2 h-2 bg-white border border-black rounded-full" />
          <div className="absolute top-4 right-2 w-2 h-2 bg-white border border-black rounded-full" />
          <div className="absolute top-6 left-1 right-1 h-2 bg-amber-900" />
          <div className="absolute top-8 left-1 right-1 h-4 bg-red-600" />
          <div className="absolute bottom-8 left-1 w-4 h-6 bg-blue-600" />
          <div className="absolute bottom-8 right-1 w-4 h-6 bg-blue-600" />
          <div className="absolute top-9 left-3 w-1 h-1 bg-yellow-400 rounded-full" />
          <div className="absolute top-9 right-3 w-1 h-1 bg-yellow-400 rounded-full" />
          <div className="absolute bottom-0 left-0 w-4 h-3 bg-amber-900" />
          <div className="absolute bottom-0 right-0 w-4 h-3 bg-amber-900" />
        </div>
      </div>

      {/* Flag at end */}
      <div className="absolute bottom-32" style={{ left: 750 }}>
        <div className="w-2 h-40 bg-gray-800" />
        <div className="absolute top-0 left-2 w-12 h-8 bg-red-500 border-2 border-white" style={{
          clipPath: 'polygon(0 0, 100% 50%, 0 100%)'
        }} />
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-amber-700 to-amber-900 border-t-8 border-amber-900">
        <div className="flex w-full h-3 bg-green-600">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="w-4 h-full border-l border-green-700" />
          ))}
        </div>
        <div className="mt-4 px-4 flex gap-2 flex-wrap">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-amber-600 border-2 border-amber-800" />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={() => setShowModal(null)}>
          <div className={`bg-gradient-to-br ${contents[showModal].color} p-8 rounded-3xl border-8 border-white max-w-2xl w-full mx-4 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}>
            <div className="bg-white bg-opacity-95 rounded-2xl p-8">
              <div className="text-6xl mb-4 text-center">{contents[showModal].icon}</div>
              <h2 className="text-4xl font-bold mb-2 text-gray-800 text-center">
                {contents[showModal].title}
              </h2>
              <p className="text-lg text-gray-500 mb-4 text-center italic">
                {contents[showModal].subtitle}
              </p>
              <p className="text-lg text-gray-700 whitespace-pre-line leading-relaxed">
                {contents[showModal].text}
              </p>
              <button
                onClick={() => setShowModal(null)}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-lg">
                Tiếp tục phiêu lưu! 🎮
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Complete */}
      {levelComplete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-12 rounded-3xl border-8 border-white text-center">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-6xl font-bold text-white mb-4" style={{ textShadow: '4px 4px 0 #000' }}>
              LEVEL CLEAR!
            </h2>
            <p className="text-2xl text-white mb-8">Bạn đã hoàn thành màn {currentLevel + 1}!</p>
            {currentLevel < levels.length - 1 ? (
              <button
                onClick={nextLevel}
                className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full font-bold text-2xl hover:scale-110 transition-transform border-4 border-white shadow-lg">
                Màn tiếp theo →
              </button>
            ) : (
              <div>
                <p className="text-3xl text-white font-bold mb-6">🌟 Bạn đã hoàn thành tất cả! 🌟</p>
                <button
                  onClick={() => {
                    setCurrentLevel(0);
                    setLevelComplete(false);
                    setCollectedItems(new Set());
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-full font-bold text-2xl hover:scale-110 transition-transform border-4 border-white shadow-lg">
                  Chơi lại 🔄
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarioProfile;