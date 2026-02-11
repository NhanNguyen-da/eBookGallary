import { Injectable, signal } from '@angular/core';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  description: string;
  gradient: string;
  category: string;
  specs: {
    pages: number;
    language: string;
    format: string;
    fileSize: string;
  };
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  textColor: string;
  layout: 'grid' | 'spotlight' | 'carousel';
  books: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  categories = signal<Category[]>([
    {
      id: 'business',
      name: 'Business & Leadership',
      tagline: 'Master the art of success',
      accentColor: '#FFD700', // Gold
      textColor: 'text-yellow-400',
      layout: 'spotlight',
      books: [
        {
          id: 'b1',
          title: 'Zero to One',
          author: 'Peter Thiel',
          year: 2014,
          description: 'Notes on startups, or how to build the future. The next Bill Gates will not build an operating system. The next Larry Page or Sergey Brin won’t make a search engine.',
          gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          category: 'Business',
          specs: { pages: 224, language: 'English', format: 'PDF', fileSize: '4MB' },
          tags: ['Startup', 'Innovation', 'Strategy']
        },
        {
          id: 'b2',
          title: 'The Lean Startup',
          author: 'Eric Ries',
          year: 2011,
          description: 'How Today’s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.',
          gradient: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
          category: 'Business',
          specs: { pages: 336, language: 'English', format: 'ePub', fileSize: '6MB' },
          tags: ['Management', 'Product', 'Agile']
        },
        {
          id: 'b3',
          title: 'Principles',
          author: 'Ray Dalio',
          year: 2017,
          description: 'Ray Dalio shares the unconventional principles that he’s developed, refined, and used over the past forty years to create unique results.',
          gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          category: 'Business',
          specs: { pages: 592, language: 'English', format: 'PDF', fileSize: '12MB' },
          tags: ['Life', 'Work', 'Philosophy']
        },
        {
          id: 'b4',
          title: 'Thinking, Fast and Slow',
          author: 'Daniel Kahneman',
          year: 2011,
          description: 'The major New York Times bestseller that has changed the way we think about thinking.',
          gradient: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
          category: 'Business',
          specs: { pages: 499, language: 'English', format: 'PDF', fileSize: '8MB' },
          tags: ['Psychology', 'Decision Making', 'Economics']
        },
        {
          id: 'b5',
          title: 'Good to Great',
          author: 'Jim Collins',
          year: 2001,
          description: 'Can a good company become a great company and if so, how?',
          gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
          category: 'Business',
          specs: { pages: 300, language: 'English', format: 'ePub', fileSize: '5MB' },
          tags: ['Management', 'Leadership', 'Research']
        },
        {
          id: 'b6',
          title: 'Deep Work',
          author: 'Cal Newport',
          year: 2016,
          description: 'Rules for Focused Success in a Distracted World.',
          gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
          category: 'Business',
          specs: { pages: 304, language: 'English', format: 'PDF', fileSize: '3MB' },
          tags: ['Productivity', 'Focus', 'Career']
        }
      ]
    },
    {
      id: 'tech',
      name: 'Technology & Innovation',
      tagline: 'Shaping the digital frontier',
      accentColor: '#00D9FF', // Cyan
      textColor: 'text-cyan-400',
      layout: 'grid',
      books: [
        {
          id: 't1',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          year: 2008,
          description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
          gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
          category: 'Technology',
          specs: { pages: 464, language: 'English', format: 'PDF', fileSize: '15MB' },
          tags: ['Programming', 'Best Practices', 'Software']
        },
        {
          id: 't2',
          title: 'The Pragmatic Programmer',
          author: 'Andrew Hunt',
          year: 1999,
          description: 'One of the most significant books in my life. Obsolete in some areas, but the concepts are timeless.',
          gradient: 'linear-gradient(135deg, #e65c00 0%, #F9D423 100%)',
          category: 'Technology',
          specs: { pages: 352, language: 'English', format: 'ePub', fileSize: '7MB' },
          tags: ['Career', 'Craftsmanship', 'Coding']
        },
        {
          id: 't3',
          title: 'Design Patterns',
          author: 'Gang of Four',
          year: 1994,
          description: 'Elements of Reusable Object-Oriented Software. The classic book on software patterns.',
          gradient: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
          category: 'Technology',
          specs: { pages: 395, language: 'English', format: 'PDF', fileSize: '18MB' },
          tags: ['Architecture', 'OOP', 'Classic']
        },
        {
          id: 't4',
          title: 'Structure & Interpretation',
          author: 'Abelson & Sussman',
          year: 1996,
          description: 'SICP is the wizard book. It teaches you how to think about computation.',
          gradient: 'linear-gradient(135deg, #614385 0%, #516395 100%)',
          category: 'Technology',
          specs: { pages: 657, language: 'English', format: 'PDF', fileSize: '22MB' },
          tags: ['CS', 'Lisp', 'Fundamentals']
        },
        {
          id: 't5',
          title: 'You Don\'t Know JS',
          author: 'Kyle Simpson',
          year: 2015,
          description: 'A deep dive into the core mechanisms of the JavaScript language.',
          gradient: 'linear-gradient(135deg, #F7971E 0%, #FFD200 100%)',
          category: 'Technology',
          specs: { pages: 200, language: 'English', format: 'ePub', fileSize: '2MB' },
          tags: ['JavaScript', 'Web', 'Deep Dive']
        },
        {
          id: 't6',
          title: 'Designing Data-Intensive Apps',
          author: 'Martin Kleppmann',
          year: 2017,
          description: 'The big ideas behind reliable, scalable, and maintainable systems.',
          gradient: 'linear-gradient(135deg, #AA076B 0%, #61045F 100%)',
          category: 'Technology',
          specs: { pages: 616, language: 'English', format: 'PDF', fileSize: '14MB' },
          tags: ['Distributed Systems', 'Data', 'Architecture']
        }
      ]
    },
    {
      id: 'fiction',
      name: 'Literary Fiction',
      tagline: 'Worlds within words',
      accentColor: '#9D4EDD', // Purple
      textColor: 'text-purple-400',
      layout: 'carousel',
      books: [
        {
          id: 'f1',
          title: '1984',
          author: 'George Orwell',
          year: 1949,
          description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
          gradient: 'linear-gradient(135deg, #20002c 0%, #cbb4d4 100%)',
          category: 'Fiction',
          specs: { pages: 328, language: 'English', format: 'ePub', fileSize: '3MB' },
          tags: ['Dystopia', 'Classic', 'Political']
        },
        {
          id: 'f2',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          year: 1925,
          description: 'The story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan.',
          gradient: 'linear-gradient(135deg, #DA4453 0%, #89216B 100%)',
          category: 'Fiction',
          specs: { pages: 180, language: 'English', format: 'PDF', fileSize: '2MB' },
          tags: ['Classic', 'American Dream', 'Romance']
        },
        {
          id: 'f3',
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          year: 1813,
          description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.',
          gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
          category: 'Fiction',
          specs: { pages: 279, language: 'English', format: 'ePub', fileSize: '4MB' },
          tags: ['Romance', 'Classic', 'Satire']
        },
        {
          id: 'f4',
          title: 'Dune',
          author: 'Frank Herbert',
          year: 1965,
          description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange.',
          gradient: 'linear-gradient(135deg, #eacda3 0%, #d6ae7b 100%)',
          category: 'Fiction',
          specs: { pages: 412, language: 'English', format: 'PDF', fileSize: '10MB' },
          tags: ['Sci-Fi', 'Epic', 'Adventure']
        },
        {
          id: 'f5',
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          year: 1951,
          description: 'The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.',
          gradient: 'linear-gradient(135deg, #93291E 0%, #ED213A 100%)',
          category: 'Fiction',
          specs: { pages: 234, language: 'English', format: 'ePub', fileSize: '3MB' },
          tags: ['Classic', 'Coming of Age', 'Literary']
        },
        {
          id: 'f6',
          title: 'Brave New World',
          author: 'Aldous Huxley',
          year: 1932,
          description: 'A searching vision of an unequal, technologically-advanced future where humans are genetically bred.',
          gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
          category: 'Fiction',
          specs: { pages: 311, language: 'English', format: 'PDF', fileSize: '4MB' },
          tags: ['Dystopia', 'Sci-Fi', 'Classic']
        },
        {
          id: 'f7',
          title: 'Fahrenheit 451',
          author: 'Ray Bradbury',
          year: 1953,
          description: 'Guy Montag is a fireman. His job is to destroy the most illegal of commodities, the printed book, along with the houses in which they are hidden.',
          gradient: 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)',
          category: 'Fiction',
          specs: { pages: 249, language: 'English', format: 'ePub', fileSize: '3MB' },
          tags: ['Dystopia', 'Censorship', 'Classic']
        },
        {
          id: 'f8',
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          year: 1937,
          description: 'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.',
          gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          category: 'Fiction',
          specs: { pages: 310, language: 'English', format: 'PDF', fileSize: '5MB' },
          tags: ['Fantasy', 'Adventure', 'Classic']
        }
      ]
    },
    {
      id: 'science',
      name: 'Science & Nature',
      tagline: 'Understanding our universe',
      accentColor: '#00FF87', // Green
      textColor: 'text-green-400',
      layout: 'grid',
      books: [
        {
          id: 's1',
          title: 'Cosmos',
          author: 'Carl Sagan',
          year: 1980,
          description: 'The story of cosmic evolution, science and civilization. Sagan traces the origins of knowledge and the scientific method.',
          gradient: 'linear-gradient(135deg, #021B79 0%, #0575E6 100%)',
          category: 'Science',
          specs: { pages: 365, language: 'English', format: 'PDF', fileSize: '16MB' },
          tags: ['Space', 'History', 'Physics']
        },
        {
          id: 's2',
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          year: 2011,
          description: 'A Brief History of Humankind. One hundred thousand years ago, at least six different species of humans inhabited Earth.',
          gradient: 'linear-gradient(135deg, #D38312 0%, #A83279 100%)',
          category: 'Science',
          specs: { pages: 443, language: 'English', format: 'ePub', fileSize: '9MB' },
          tags: ['History', 'Anthropology', 'Biology']
        },
        {
          id: 's3',
          title: 'A Brief History of Time',
          author: 'Stephen Hawking',
          year: 1988,
          description: 'A landmark volume in science writing by one of the great minds of our time, exploring such profound questions as: How did the universe begin?',
          gradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
          category: 'Science',
          specs: { pages: 212, language: 'English', format: 'PDF', fileSize: '5MB' },
          tags: ['Physics', 'Cosmology', 'Space']
        },
        {
          id: 's4',
          title: 'The Selfish Gene',
          author: 'Richard Dawkins',
          year: 1976,
          description: 'Professor Dawkins articulates a gene\'s eye view of evolution - a view giving centre stage to these persistent units of information.',
          gradient: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
          category: 'Science',
          specs: { pages: 360, language: 'English', format: 'PDF', fileSize: '7MB' },
          tags: ['Biology', 'Evolution', 'Genetics']
        },
        {
          id: 's5',
          title: 'Silent Spring',
          author: 'Rachel Carson',
          year: 1962,
          description: 'Rarely does a single book alter the course of history, but Silent Spring did exactly that by spurring a revolutionary new environmental movement.',
          gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
          category: 'Science',
          specs: { pages: 368, language: 'English', format: 'ePub', fileSize: '4MB' },
          tags: ['Environment', 'Ecology', 'Nature']
        },
        {
          id: 's6',
          title: 'The Gene',
          author: 'Siddhartha Mukherjee',
          year: 2016,
          description: 'The story of the gene begins in an obscure Augustinian abbey in Moravia in 1856, where a monk stumbles on the idea of a "unit of heredity".',
          gradient: 'linear-gradient(135deg, #4568DC 0%, #B06AB3 100%)',
          category: 'Science',
          specs: { pages: 592, language: 'English', format: 'PDF', fileSize: '12MB' },
          tags: ['Genetics', 'History', 'Biology']
        }
      ]
    }
  ]);

  activeBook = signal<Book | null>(null);

  setActiveBook(book: Book | null) {
    this.activeBook.set(book);
  }
}