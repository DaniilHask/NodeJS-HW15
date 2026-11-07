import 'reflect-metadata';
import { AppDataSource } from './data-source.migrations.js';
import { User } from './entities/User.js';
import { Newspost } from './entities/Newspost.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding...');

    const userRepository: any = AppDataSource.getRepository(User);
    const postRepository: any = AppDataSource.getRepository(Newspost);

    let standardUser = await userRepository.findOne({ where: { email: 'test@example.com' } });
    
    if (!standardUser) {
      const hashedPassword = await bcrypt.hash('12345', 10);
      standardUser = userRepository.create({
        email: 'test@example.com',
        password: hashedPassword,
        deleted: false,
      });
      await userRepository.save(standardUser);
      console.log('tandard user created: test@example.com / 12345');
    } else {
      console.log('Standard user already exists.');
    }

    console.log('Fetching posts from JSONPlaceholder...');
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const jsonPosts = (await response.json()) as Array<{ title: string; body: string }>;

    const postsToCreate = jsonPosts.slice(0, 20);

    const genres: Array<'Politic' | 'Business' | 'Sport' | 'Other'> = ['Politic', 'Business', 'Sport', 'Other'];

    const newPosts = postsToCreate.map((item, index) => {
      return postRepository.create({
        header: item.title.substring(0, 50),
        text: item.body,
        genre: genres[index % genres.length],
        isPrivate: index % 3 === 0,
        deleted: false,
        author: standardUser,
        authorId: standardUser.id,
      });
    });

    await postRepository.save(newPosts);
    console.log(`Successfully seeded ${newPosts.length} news posts!`);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();