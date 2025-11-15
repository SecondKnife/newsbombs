import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { resolve } from 'path';
import { User } from './users/user.entity';
import { Article } from './articles/article.entity';

// Load .env file from root or backend directory
config({ path: resolve(__dirname, '../../.env') });
config({ path: resolve(__dirname, '../.env') });

async function seed() {
  // Support both connection string and individual parameters
  let dataSourceConfig: any;
  
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    // Use connection string if available
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    dataSourceConfig = {
      type: 'postgres',
      url: connectionString,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables for seed
      ssl: { rejectUnauthorized: false }, // Required for Neon
    };
  } else {
    // Use individual parameters
    dataSourceConfig = {
      type: 'postgres',
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DB_NAME || process.env.POSTGRES_DATABASE || 'newsbombs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables for seed
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  const dataSource = new DataSource(dataSourceConfig);

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const articleRepository = dataSource.getRepository(Article);

  // Check if admin user exists
  let adminUser = await userRepository.findOne({
    where: { email: 'admin@newsbombs.com' },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@newsbombs.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
    });
    await userRepository.save(adminUser);
    console.log('✓ Admin user created');
    console.log('  Email: admin@newsbombs.com');
    console.log('  Password: admin123');
  } else {
    console.log('✓ Admin user already exists');
  }

  // Seed articles
  const existingArticles = await articleRepository.count();
  if (existingArticles === 0) {
    console.log('\n📰 Seeding articles...');
    
    const articles = [
      {
        title: 'Khởi nghiệp công nghệ Việt Nam thu hút đầu tư kỷ lục năm 2024',
        summary: 'Năm 2024 chứng kiến sự bùng nổ đầu tư vào các startup công nghệ Việt Nam với tổng giá trị lên tới hàng trăm triệu USD, đánh dấu một cột mốc quan trọng trong hệ sinh thái khởi nghiệp.',
        content: `Năm 2024 đã trở thành một năm đột phá cho hệ sinh thái khởi nghiệp công nghệ Việt Nam khi các startup trong nước thu hút được số vốn đầu tư kỷ lục từ các quỹ đầu tư quốc tế và trong nước.

## Tăng trưởng mạnh mẽ

Theo báo cáo mới nhất từ Hiệp hội Doanh nghiệp Công nghệ Việt Nam, tổng giá trị đầu tư vào các startup công nghệ trong năm 2024 đã đạt hơn 500 triệu USD, tăng 150% so với năm trước. Đây là mức tăng trưởng cao nhất trong lịch sử khởi nghiệp Việt Nam.

## Các lĩnh vực được ưa chuộng

Các lĩnh vực công nghệ tài chính (FinTech), thương mại điện tử (E-commerce), và công nghệ giáo dục (EdTech) đang dẫn đầu trong việc thu hút vốn đầu tư. Nhiều startup trong các lĩnh vực này đã đạt được các vòng gọi vốn Series A và Series B thành công.

## Sự quan tâm từ các quỹ quốc tế

Các quỹ đầu tư lớn từ Singapore, Nhật Bản, Hàn Quốc và Mỹ đang ngày càng quan tâm đến thị trường Việt Nam. Họ đánh giá cao tiềm năng tăng trưởng và chất lượng đội ngũ kỹ sư công nghệ tại đây.

## Hỗ trợ từ chính phủ

Chính phủ Việt Nam đã triển khai nhiều chính sách hỗ trợ khởi nghiệp, bao gồm các ưu đãi thuế, hỗ trợ vốn và tạo môi trường pháp lý thuận lợi cho các doanh nghiệp công nghệ phát triển.

## Tương lai tươi sáng

Với sự phát triển mạnh mẽ của hệ sinh thái khởi nghiệp, Việt Nam đang trên đường trở thành một trung tâm công nghệ quan trọng trong khu vực Đông Nam Á. Các chuyên gia dự đoán xu hướng này sẽ tiếp tục tăng trưởng trong những năm tới.`,
        slug: 'vietnam-tech-startup-funding-2024',
        date: new Date('2024-11-15'),
        tags: ['công nghệ', 'khởi nghiệp', 'đầu tư'],
        images: ['/static/images/github-traffic.png', '/imgs/openapi.png'],
        draft: false,
        layout: 'PostLayout',
        authorId: adminUser.id,
      },
      {
        title: 'Việt Nam đẩy mạnh phát triển trí tuệ nhân tạo và ứng dụng thực tế',
        summary: 'Việt Nam đang đầu tư mạnh mẽ vào nghiên cứu và phát triển trí tuệ nhân tạo, với nhiều ứng dụng thực tế đang được triển khai trong các lĩnh vực y tế, giáo dục và nông nghiệp.',
        content: `Việt Nam đang nhanh chóng trở thành một trong những quốc gia đi đầu trong việc ứng dụng trí tuệ nhân tạo (AI) tại khu vực Đông Nam Á, với nhiều dự án và sáng kiến đang được triển khai trên khắp cả nước.

## Ứng dụng trong y tế

Các bệnh viện lớn tại Việt Nam đã bắt đầu sử dụng AI để hỗ trợ chẩn đoán bệnh, phân tích hình ảnh y tế và dự đoán nguy cơ bệnh tật. Công nghệ này giúp tăng độ chính xác trong chẩn đoán và giảm thời gian xử lý.

## Giáo dục thông minh

Nhiều trường đại học và tổ chức giáo dục đang tích hợp AI vào hệ thống học tập, tạo ra các nền tảng học tập cá nhân hóa và hệ thống đánh giá tự động. Điều này giúp nâng cao chất lượng giáo dục và trải nghiệm học tập.

## Nông nghiệp thông minh

AI đang được ứng dụng trong nông nghiệp để tối ưu hóa sản xuất, dự đoán thời tiết, quản lý tưới tiêu và phát hiện sâu bệnh. Các giải pháp này giúp nông dân tăng năng suất và giảm chi phí sản xuất.

## Hỗ trợ từ các tập đoàn công nghệ

Các tập đoàn công nghệ lớn như FPT, Viettel và VNPT đang đầu tư mạnh vào nghiên cứu và phát triển AI. Họ đã thành lập các trung tâm nghiên cứu AI và hợp tác với các trường đại học hàng đầu.

## Chính sách quốc gia về AI

Chính phủ Việt Nam đã công bố Chiến lược Quốc gia về Trí tuệ Nhân tạo đến năm 2030, với mục tiêu đưa Việt Nam trở thành một trong những quốc gia hàng đầu về AI trong khu vực.`,
        slug: 'vietnam-ai-development-2024',
        date: new Date('2024-11-14'),
        tags: ['trí tuệ nhân tạo', 'AI', 'công nghệ'],
        images: ['/static/images/debug-in-nodejs.png', '/imgs/dthc_cpp.png'],
        draft: false,
        layout: 'PostLayout',
        authorId: adminUser.id,
      },
      {
        title: 'Việt Nam mở rộng mạng 5G trên toàn quốc, đẩy nhanh chuyển đổi số',
        summary: 'Các nhà mạng Việt Nam đang đẩy nhanh việc triển khai mạng 5G trên toàn quốc, mang lại tốc độ internet nhanh hơn và hỗ trợ các ứng dụng công nghệ mới.',
        content: `Việt Nam đang bước vào giai đoạn mới trong việc phát triển hạ tầng viễn thông với việc mở rộng mạng 5G trên toàn quốc, tạo nền tảng vững chắc cho quá trình chuyển đổi số.

## Triển khai trên diện rộng

Các nhà mạng lớn như Viettel, VNPT và MobiFone đã bắt đầu triển khai mạng 5G tại các thành phố lớn như Hà Nội, TP. Hồ Chí Minh, Đà Nẵng và đang mở rộng ra các tỉnh thành khác. Dự kiến đến cuối năm 2024, mạng 5G sẽ phủ sóng tại hơn 50 tỉnh thành.

## Tốc độ và hiệu suất vượt trội

Mạng 5G mang lại tốc độ internet nhanh hơn 10-100 lần so với 4G, với độ trễ thấp và khả năng kết nối nhiều thiết bị đồng thời. Điều này mở ra nhiều cơ hội cho các ứng dụng công nghệ mới như Internet of Things (IoT), xe tự lái và thực tế ảo.

## Ứng dụng trong các lĩnh vực

Mạng 5G đang được ứng dụng trong nhiều lĩnh vực như y tế từ xa, giáo dục trực tuyến, sản xuất thông minh và thành phố thông minh. Các ứng dụng này giúp nâng cao chất lượng cuộc sống và hiệu quả sản xuất.

## Đầu tư hạ tầng

Các nhà mạng đang đầu tư hàng nghìn tỷ đồng để nâng cấp hạ tầng mạng, lắp đặt các trạm phát sóng 5G và nâng cấp hệ thống mạng lõi. Đây là một trong những khoản đầu tư lớn nhất trong lịch sử viễn thông Việt Nam.`,
        slug: 'vietnam-5g-network-expansion',
        date: new Date('2024-11-13'),
        tags: ['5G', 'viễn thông', 'chuyển đổi số'],
        images: ['/static/images/ocean.jpeg', '/imgs/trucking.jpeg'],
        draft: false,
        layout: 'PostLayout',
        authorId: adminUser.id,
      },
      {
        title: 'Việt Nam tăng cường an ninh mạng trước các mối đe dọa ngày càng phức tạp',
        summary: 'Trước sự gia tăng các cuộc tấn công mạng, Việt Nam đang tăng cường các biện pháp bảo mật và phát triển năng lực an ninh mạng để bảo vệ cơ sở hạ tầng số quốc gia.',
        content: `Trong bối cảnh các mối đe dọa an ninh mạng ngày càng phức tạp và tinh vi, Việt Nam đang nỗ lực tăng cường khả năng phòng thủ và ứng phó với các cuộc tấn công mạng.

## Tăng cường pháp luật

Quốc hội Việt Nam đã thông qua Luật An ninh mạng và các văn bản hướng dẫn thi hành, tạo khung pháp lý vững chắc cho việc bảo vệ an ninh mạng. Luật này yêu cầu các doanh nghiệp và tổ chức phải tuân thủ các tiêu chuẩn bảo mật nghiêm ngặt.

## Nâng cao năng lực

Các cơ quan chức năng đang đầu tư vào việc đào tạo chuyên gia an ninh mạng và phát triển các trung tâm ứng phó sự cố an ninh mạng (CSIRT). Nhiều trường đại học đã mở các chương trình đào tạo chuyên sâu về an ninh mạng.

## Hợp tác quốc tế

Việt Nam đang hợp tác với các tổ chức quốc tế và các quốc gia khác trong việc chia sẻ thông tin về các mối đe dọa mạng và phát triển các giải pháp bảo mật chung. Điều này giúp nâng cao khả năng phòng thủ của quốc gia.

## Bảo vệ cơ sở hạ tầng quan trọng

Các cơ sở hạ tầng quan trọng như hệ thống ngân hàng, năng lượng, giao thông và y tế đang được ưu tiên bảo vệ. Các biện pháp bảo mật đa lớp đang được triển khai để ngăn chặn các cuộc tấn công.`,
        slug: 'vietnam-cybersecurity-2024',
        date: new Date('2024-11-12'),
        tags: ['an ninh mạng', 'bảo mật', 'công nghệ'],
        images: ['/static/images/google.png', '/imgs/dtite.png'],
        draft: false,
        layout: 'PostLayout',
        authorId: adminUser.id,
      },
      {
        title: 'Thương mại điện tử Việt Nam tăng trưởng mạnh, đạt 20 tỷ USD năm 2024',
        summary: 'Thị trường thương mại điện tử Việt Nam tiếp tục tăng trưởng mạnh mẽ, đạt giá trị 20 tỷ USD trong năm 2024, với sự tham gia của hàng triệu người dùng và doanh nghiệp.',
        content: `Thị trường thương mại điện tử Việt Nam đang trải qua giai đoạn tăng trưởng bùng nổ, đạt giá trị 20 tỷ USD trong năm 2024 và được dự báo sẽ tiếp tục tăng trưởng mạnh trong những năm tới.

## Tăng trưởng ấn tượng

Theo báo cáo từ Hiệp hội Thương mại Điện tử Việt Nam, thị trường e-commerce đã tăng trưởng 35% so với năm trước, vượt xa các dự báo ban đầu. Số lượng người dùng mua sắm trực tuyến đã tăng lên hơn 60 triệu người.

## Các sàn thương mại điện tử hàng đầu

Các sàn thương mại điện tử như Shopee, Lazada, Tiki và Sendo tiếp tục dẫn đầu thị trường với doanh thu tăng trưởng mạnh. Nhiều sàn mới cũng đã ra đời, tạo ra sự cạnh tranh lành mạnh.

## Mua sắm trên di động

Hơn 80% giao dịch thương mại điện tử được thực hiện trên thiết bị di động, phản ánh xu hướng mua sắm di động đang phát triển mạnh. Các ứng dụng mua sắm đang được tối ưu hóa để mang lại trải nghiệm tốt nhất cho người dùng.

## Thanh toán số

Các phương thức thanh toán số như ví điện tử, thẻ tín dụng và chuyển khoản ngân hàng đang ngày càng phổ biến. Nhiều người dùng đã chuyển từ thanh toán tiền mặt sang thanh toán số.

## Logistics và giao hàng

Hệ thống logistics và giao hàng đang được cải thiện đáng kể, với nhiều công ty giao hàng nhanh ra đời. Thời gian giao hàng đã được rút ngắn từ 3-5 ngày xuống còn 1-2 ngày tại các thành phố lớn.`,
        slug: 'vietnam-ecommerce-growth-2024',
        date: new Date('2024-11-11'),
        tags: ['thương mại điện tử', 'e-commerce', 'kinh tế số'],
        images: ['/imgs/shop.jpg', '/imgs/buysimvietnam.au.jpeg'],
        draft: false,
        layout: 'PostLayout',
        authorId: adminUser.id,
      },
      {
        title: 'Việt Nam đẩy mạnh chuyển đổi năng lượng xanh, hướng tới mục tiêu carbon trung tính',
        summary: 'Việt Nam đang đẩy mạnh phát triển năng lượng tái tạo và chuyển đổi sang năng lượng xanh, với mục tiêu đạt carbon trung tính vào năm 2050.',
        content: `Việt Nam đang thực hiện những bước tiến quan trọng trong việc chuyển đổi sang năng lượng xanh, với nhiều dự án năng lượng tái tạo quy mô lớn đang được triển khai trên khắp cả nước.

## Phát triển năng lượng mặt trời

Việt Nam đã trở thành một trong những quốc gia dẫn đầu Đông Nam Á về công suất lắp đặt điện mặt trời, với tổng công suất đạt hơn 16 GW. Nhiều dự án điện mặt trời quy mô lớn đang được xây dựng tại các tỉnh miền Trung và miền Nam.

## Năng lượng gió

Các dự án điện gió đang được phát triển mạnh mẽ, đặc biệt là tại các vùng ven biển. Việt Nam có tiềm năng lớn về năng lượng gió với tốc độ gió trung bình cao và điều kiện địa lý thuận lợi.

## Đầu tư từ nước ngoài

Nhiều nhà đầu tư quốc tế đang quan tâm đến thị trường năng lượng tái tạo Việt Nam, mang theo công nghệ tiên tiến và nguồn vốn lớn. Điều này giúp đẩy nhanh quá trình chuyển đổi năng lượng.

## Chính sách hỗ trợ

Chính phủ Việt Nam đã ban hành nhiều chính sách ưu đãi cho các dự án năng lượng tái tạo, bao gồm giá mua điện ưu đãi (FIT) và các ưu đãi thuế. Điều này tạo động lực cho các nhà đầu tư.

## Mục tiêu carbon trung tính

Tại Hội nghị COP26, Việt Nam đã cam kết đạt mục tiêu carbon trung tính vào năm 2050. Để đạt được mục tiêu này, quốc gia cần tăng tỷ trọng năng lượng tái tạo lên ít nhất 30% vào năm 2030.`,
        slug: 'vietnam-green-energy-transition',
        date: new Date('2024-11-10'),
        tags: ['năng lượng tái tạo', 'môi trường', 'phát triển bền vững'],
        images: ['/static/images/canada/mountains.jpg', '/static/images/canada/lake.jpg'],
        draft: false,
        layout: 'PostLayout',
        authorId: adminUser.id,
      },
    ];

    for (const articleData of articles) {
      const article = articleRepository.create(articleData);
      await articleRepository.save(article);
      console.log(`  ✓ Created: ${article.title}`);
    }

    console.log(`\n✅ Successfully seeded ${articles.length} articles`);
  } else {
    console.log(`\n✓ Articles already exist (${existingArticles} articles)`);
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});

