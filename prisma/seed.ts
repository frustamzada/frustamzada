import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@predictpro.az" },
    update: {},
    create: {
      email: "admin@predictpro.az",
      name: "PredictPro Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
      preferredLanguage: "az",
      isVerified: true,
      ageVerified: true,
      badge: "MASTER",
      totalPredictions: 250,
      wonPredictions: 175,
      lostPredictions: 75,
      successRate: 70.0,
    },
  });

  // Create analyst
  const analystPassword = await bcrypt.hash("analyst123", 10);
  const analyst = await prisma.user.upsert({
    where: { email: "analyst@predictpro.az" },
    update: {},
    create: {
      email: "analyst@predictpro.az",
      name: "Elvin Mammadov",
      passwordHash: analystPassword,
      role: "ADMIN",
      preferredLanguage: "az",
      isVerified: true,
      ageVerified: true,
      badge: "EXPERT",
      bio: "Senior sports analyst at PredictPro",
      totalPredictions: 180,
      wonPredictions: 120,
      lostPredictions: 60,
      successRate: 66.7,
    },
  });

  // Create collaborator
  const collabPassword = await bcrypt.hash("collab123", 10);
  const collaborator = await prisma.user.upsert({
    where: { email: "expert@predictpro.az" },
    update: {},
    create: {
      email: "expert@predictpro.az",
      name: "Rashad Aliyev",
      passwordHash: collabPassword,
      role: "COLLABORATOR",
      preferredLanguage: "az",
      isVerified: true,
      ageVerified: true,
      badge: "EXPERT",
      collaboratorBio: "Football expert with 10+ years of analysis experience",
      subscriptionPriceAZN: 9.99,
      totalPredictions: 320,
      wonPredictions: 208,
      lostPredictions: 112,
      successRate: 65.0,
    },
  });

  // Create regular users
  const userPassword = await bcrypt.hash("user123", 10);
  const user1 = await prisma.user.upsert({
    where: { email: "user@predictpro.az" },
    update: {},
    create: {
      email: "user@predictpro.az",
      name: "Aysel Huseynova",
      passwordHash: userPassword,
      role: "FREE",
      preferredLanguage: "az",
      isVerified: true,
      ageVerified: true,
      badge: "RISING_STAR",
      totalPredictions: 45,
      wonPredictions: 28,
      lostPredictions: 17,
      successRate: 62.2,
    },
  });

  const premiumPassword = await bcrypt.hash("premium123", 10);
  const premiumUser = await prisma.user.upsert({
    where: { email: "premium@predictpro.az" },
    update: {},
    create: {
      email: "premium@predictpro.az",
      name: "Farid Guliyev",
      passwordHash: premiumPassword,
      role: "PREMIUM",
      preferredLanguage: "en",
      isVerified: true,
      ageVerified: true,
      badge: "EXPERT",
      totalPredictions: 95,
      wonPredictions: 62,
      lostPredictions: 33,
      successRate: 65.3,
    },
  });

  // Create matches
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const matches = await Promise.all([
    prisma.match.create({
      data: {
        sport: "FOOTBALL",
        league: "Azerbaijan Premier League",
        homeTeam: "Qarabag FK",
        awayTeam: "Neftchi PFK",
        matchDate: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        isLive: false,
        oddsMisliHome: 1.65,
        oddsMisliDraw: 3.50,
        oddsMisliAway: 5.25,
        oddsTopazHome: 1.70,
        oddsTopazDraw: 3.40,
        oddsTopazAway: 5.00,
        venue: "Tofik Bahramov Republican Stadium",
      },
    }),
    prisma.match.create({
      data: {
        sport: "FOOTBALL",
        league: "Azerbaijan Premier League",
        homeTeam: "Zira FK",
        awayTeam: "Sabah FK",
        matchDate: tomorrow,
        isLive: false,
        oddsMisliHome: 2.10,
        oddsMisliDraw: 3.25,
        oddsMisliAway: 3.40,
        oddsTopazHome: 2.15,
        oddsTopazDraw: 3.20,
        oddsTopazAway: 3.30,
      },
    }),
    prisma.match.create({
      data: {
        sport: "FOOTBALL",
        league: "UEFA Champions League",
        homeTeam: "Real Madrid",
        awayTeam: "Manchester City",
        matchDate: tomorrow,
        isLive: false,
        oddsMisliHome: 2.20,
        oddsMisliDraw: 3.30,
        oddsMisliAway: 3.10,
        oddsTopazHome: 2.25,
        oddsTopazDraw: 3.25,
        oddsTopazAway: 3.05,
        venue: "Santiago Bernabeu",
      },
    }),
    prisma.match.create({
      data: {
        sport: "FOOTBALL",
        league: "English Premier League",
        homeTeam: "Arsenal",
        awayTeam: "Liverpool",
        matchDate: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        isLive: true,
        homeScore: 1,
        awayScore: 2,
        oddsMisliHome: 2.50,
        oddsMisliDraw: 3.40,
        oddsMisliAway: 2.80,
        oddsTopazHome: 2.45,
        oddsTopazDraw: 3.35,
        oddsTopazAway: 2.85,
        venue: "Emirates Stadium",
      },
    }),
    prisma.match.create({
      data: {
        sport: "FOOTBALL",
        league: "English Premier League",
        homeTeam: "Chelsea",
        awayTeam: "Tottenham",
        matchDate: yesterday,
        isLive: false,
        isFinished: true,
        homeScore: 2,
        awayScore: 1,
        oddsMisliHome: 1.90,
        oddsMisliDraw: 3.50,
        oddsMisliAway: 4.00,
        oddsTopazHome: 1.85,
        oddsTopazDraw: 3.55,
        oddsTopazAway: 4.10,
        venue: "Stamford Bridge",
      },
    }),
    prisma.match.create({
      data: {
        sport: "BASKETBALL",
        league: "NBA",
        homeTeam: "Los Angeles Lakers",
        awayTeam: "Golden State Warriors",
        matchDate: tomorrow,
        isLive: false,
        oddsMisliHome: 1.85,
        oddsMisliDraw: null,
        oddsMisliAway: 1.95,
        oddsTopazHome: 1.80,
        oddsTopazDraw: null,
        oddsTopazAway: 2.00,
      },
    }),
  ]);

  // Create predictions
  await Promise.all([
    prisma.prediction.create({
      data: {
        userId: admin.id,
        matchId: matches[0].id,
        predictionType: "MATCH_WINNER",
        prediction: "HOME",
        odds: 1.65,
        confidence: 8,
        reasoning:
          "Qarabag evdə çox güclüdür. Son 10 ev matçında 8 qələbə. Neftçi səfərdə zəif formadadır.",
        language: "az",
        status: "PENDING",
        isPremium: false,
      },
    }),
    prisma.prediction.create({
      data: {
        userId: collaborator.id,
        matchId: matches[2].id,
        predictionType: "OVER_UNDER",
        prediction: "OVER 2.5",
        odds: 1.85,
        confidence: 7,
        reasoning:
          "Both teams have been scoring freely in recent matches. Real Madrid averaging 2.3 goals at home, Man City averaging 1.8 away.",
        language: "en",
        status: "PENDING",
        isPremium: true,
      },
    }),
    prisma.prediction.create({
      data: {
        userId: analyst.id,
        matchId: matches[3].id,
        predictionType: "MATCH_WINNER",
        prediction: "AWAY",
        odds: 2.80,
        confidence: 6,
        reasoning:
          "Liverpool in excellent form. Arsenal missing key defenders. Value in away win.",
        language: "en",
        status: "PENDING",
        isPremium: false,
      },
    }),
    prisma.prediction.create({
      data: {
        userId: user1.id,
        matchId: matches[4].id,
        predictionType: "CORRECT_SCORE",
        prediction: "2-1",
        odds: 7.50,
        confidence: 4,
        reasoning: "Chelsea evdə güclü. Tottenhemin müdafiəsi zəifdir.",
        language: "az",
        status: "WON",
        isPremium: false,
      },
    }),
  ]);

  // Create coupon prediction
  await prisma.couponPrediction.create({
    data: {
      userId: collaborator.id,
      title: "Weekend Premium Coupon - 3 Matches",
      reasoning:
        "Carefully selected matches based on current form and statistical analysis.",
      language: "en",
      totalOdds: 8.52,
      status: "PENDING",
      isPremium: true,
      confidence: 6,
      matches: {
        create: [
          {
            matchId: matches[0].id,
            predictionType: "MATCH_WINNER",
            prediction: "HOME",
            odds: 1.65,
            status: "PENDING",
          },
          {
            matchId: matches[2].id,
            predictionType: "OVER_UNDER",
            prediction: "OVER 2.5",
            odds: 1.85,
            status: "PENDING",
          },
          {
            matchId: matches[1].id,
            predictionType: "MATCH_WINNER",
            prediction: "DRAW",
            odds: 2.79,
            status: "PENDING",
          },
        ],
      },
    },
  });

  // Create analytics reports
  await Promise.all([
    prisma.analyticsReport.create({
      data: {
        matchId: matches[0].id,
        authorId: admin.id,
        reportType: "PRE_GAME",
        isPremium: false,
        sport: "FOOTBALL",
        league: "Azerbaijan Premier League",
        titleAz: "Qarabag vs Neftchi - Matç Öncəsi Təhlil",
        titleEn: "Qarabag vs Neftchi - Pre-Match Analysis",
        titleRu: "Карабах vs Нефтчи - Предматчевый анализ",
        contentAz:
          "Qarabag bu mövsüm evdə əla forma nümayiş etdirir. Son 10 ev matçında 8 qələbə əldə edərək, cəmi 2 heç-heçə ilə kifayətləniblər. Neftçi isə səfərdə problemlər yaşayır - son 5 səfər matçında cəmi 1 qələbə. Qarabağın hücum xətti Zoubir və Wadji ilə çox təhlükəlidir. Neftçinin müdafiəsi son matçlarda zəif görünür.\n\nStatistika:\n- Qarabag ev matçları: 8Q 2H 0M\n- Neftchi səfər matçları: 1Q 1H 3M\n- Son üz-üzə: Qarabag 3 - 0 Neftchi\n- Orta qol: 2.8 per matç",
        contentEn:
          "Qarabag has been in excellent home form this season. In their last 10 home matches, they secured 8 victories with only 2 draws. Neftchi struggles away from home - just 1 win in their last 5 away games. Qarabag's attacking line with Zoubir and Wadji poses a significant threat. Neftchi's defense has looked vulnerable in recent matches.\n\nStatistics:\n- Qarabag home record: 8W 2D 0L\n- Neftchi away record: 1W 1D 3L\n- Last H2H: Qarabag 3 - 0 Neftchi\n- Average goals: 2.8 per match",
        contentRu:
          "Карабах демонстрирует отличную домашнюю форму в этом сезоне. В последних 10 домашних матчах они одержали 8 побед при 2 ничьих. Нефтчи испытывает трудности на выезде - всего 1 победа в последних 5 выездных матчах.\n\nСтатистика:\n- Домашний рекорд Карабаха: 8П 2Н 0П\n- Выездной рекорд Нефтчи: 1П 1Н 3П",
        summaryAz: "Qarabag evdə favorit, Neftçi səfərdə zəif",
        summaryEn: "Qarabag strong favorites at home, Neftchi weak away",
        summaryRu: "Карабах фаворит дома, Нефтчи слаб на выезде",
        tags: ["qarabag", "neftchi", "azerbaijan-premier-league", "pre-game"],
        isFeatured: true,
        viewCount: 342,
      },
    }),
    prisma.analyticsReport.create({
      data: {
        matchId: matches[2].id,
        authorId: analyst.id,
        reportType: "PRE_GAME",
        isPremium: true,
        sport: "FOOTBALL",
        league: "UEFA Champions League",
        titleAz: "Real Madrid vs Man City - Champions League Dərin Təhlil",
        titleEn: "Real Madrid vs Man City - Champions League Deep Analysis",
        titleRu:
          "Реал Мадрид vs Ман Сити - Глубокий анализ Лиги Чемпионов",
        contentAz:
          "Champions League-nin ən gözlənilən matçlarından biri. Real Madrid evdə güclü, lakin Man City son matçlarda müdafiə xəttini möhkəmləndirdib. Taktiki analiz, heyət təhlili və məşqçi strategiyaları...",
        contentEn:
          "One of the most anticipated Champions League fixtures. Real Madrid strong at home, but Man City have tightened their defense in recent matches. Tactical analysis, squad review and coaching strategies included. Key battles: Vinicius Jr vs Walker, Haaland vs Rudiger.",
        contentRu:
          "Один из самых ожидаемых матчей Лиги Чемпионов. Реал Мадрид силён дома, но Ман Сити укрепил оборону в последних матчах.",
        summaryAz: "Hər iki komanda güclü, qollu matç gözlənilir",
        summaryEn: "Both teams in form, goals expected",
        summaryRu: "Обе команды в форме, ожидаются голы",
        tags: ["champions-league", "real-madrid", "man-city", "premium"],
        isFeatured: true,
        viewCount: 567,
      },
    }),
    prisma.analyticsReport.create({
      data: {
        matchId: matches[3].id,
        authorId: admin.id,
        reportType: "LIVE",
        isPremium: false,
        sport: "FOOTBALL",
        league: "English Premier League",
        titleAz: "Arsenal vs Liverpool - Canlı Təhlil",
        titleEn: "Arsenal vs Liverpool - Live Analysis",
        titleRu: "Арсенал vs Ливерпуль - Анализ в реальном времени",
        contentAz:
          "Liverpool 2-1 irəlidədir. Salah 34-cü dəqiqədə, Nunez 58-ci dəqiqədə qol vurdu. Arsenal 67-ci dəqiqədə Saka ilə 1 qol qaytardı. Liverpool kontr-hücumlarda təhlükəli görünür.",
        contentEn:
          "Liverpool lead 2-1. Salah scored at 34', Nunez at 58'. Arsenal pulled one back through Saka at 67'. Liverpool looking dangerous on the counter-attack. Arsenal pushing for an equalizer.",
        contentRu:
          "Ливерпуль ведёт 2-1. Салах забил на 34', Нуньес на 58'. Арсенал отквитал один гол через Сака на 67'.",
        summaryAz: "Liverpool 2-1 irəlidə, Arsenal bərabərlik axtarır",
        summaryEn: "Liverpool leading 2-1, Arsenal searching for equalizer",
        summaryRu: "Ливерпуль ведёт 2-1, Арсенал ищет ничью",
        tags: ["arsenal", "liverpool", "premier-league", "live"],
        isFeatured: false,
        viewCount: 1205,
      },
    }),
  ]);

  // Create some follows
  await Promise.all([
    prisma.follow.create({
      data: { followerId: user1.id, followingId: admin.id },
    }),
    prisma.follow.create({
      data: { followerId: user1.id, followingId: collaborator.id },
    }),
    prisma.follow.create({
      data: { followerId: premiumUser.id, followingId: collaborator.id },
    }),
  ]);

  // Create translations for dynamic UI elements
  await Promise.all([
    prisma.translation.create({
      data: {
        key: "sport_football",
        valueAz: "Futbol",
        valueEn: "Football",
        valueRu: "Футбол",
      },
    }),
    prisma.translation.create({
      data: {
        key: "sport_basketball",
        valueAz: "Basketbol",
        valueEn: "Basketball",
        valueRu: "Баскетбол",
      },
    }),
  ]);

  console.log("Seeding complete!");
  console.log("Admin login: admin@predictpro.az / admin123");
  console.log("Analyst login: analyst@predictpro.az / analyst123");
  console.log("Collaborator login: expert@predictpro.az / collab123");
  console.log("User login: user@predictpro.az / user123");
  console.log("Premium user login: premium@predictpro.az / premium123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
