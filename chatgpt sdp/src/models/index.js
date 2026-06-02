const mongoose = require('mongoose');

// 1. User Schema (Admin only)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Inquiry Schema
const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  course: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Contacted', 'Enrolled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// 3. AI Lead Schema (Enriched leads)
const AILeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  course: { type: String, default: '' },
  leadScore: { type: Number, default: 0 },
  aiAnalysis: { type: String, default: '' },
  chatSessionLog: [{ role: String, content: String }],
  createdAt: { type: Date, default: Date.now }
});

// 4. AI Question Log Schema
const AIQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  responseText: { type: String, required: true },
  type: { type: String, enum: ['chat', 'solve-question', 'study-plan', 'image-question', 'pdf-question'], default: 'chat' },
  leadInfo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 5. Results Schema
const ResultSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  examName: { type: String, required: true }, // e.g. Class 10, Class 12, JEE Main, NEET
  score: { type: String, required: true },    // e.g. 98.4%, AIR 245
  year: { type: String, required: true },
  photoUrl: { type: String, default: '/assets/images/placeholder-avatar.webp' },
  isTopPerformer: { type: Boolean, default: false },
  summary: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 6. Programs Schema (Courses)
const ProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Future Skills'], required: true },
  description: { type: String, required: true },
  targetClasses: { type: String, default: '' },
  syllabus: { type: [String], default: [] },
  duration: { type: String, default: '' },
  fees: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 7. Faculty Schema
const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String, default: '' },
  subjects: { type: String, default: '' },
  photoUrl: { type: String, default: '/assets/images/placeholder-avatar.webp' },
  bio: { type: String, default: '' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// 8. Gallery Schema
const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Classroom', 'Robotics', 'AI', 'Computer Lab', 'Library', 'Students', 'Faculty', 'Campus', 'Innovation', 'Science'], 
    required: true 
  },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

// 9. Events Schema
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  venue: { type: String, default: 'Digital Campus Main Hall' },
  description: { type: String, required: true },
  isWorkshop: { type: Boolean, default: true },
  maxParticipants: { type: Number, default: 50 },
  enrolledCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// 10. Testimonials Schema
const TestimonialSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Parent', 'Alumni'], required: true },
  rating: { type: Number, default: 5 },
  message: { type: String, required: true },
  photoUrl: { type: String, default: '/assets/images/placeholder-avatar.webp' },
  createdAt: { type: Date, default: Date.now }
});

// 11. Achievements Schema
const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: 'Academic' },
  recipient: { type: String, default: '' },
  description: { type: String, required: true },
  date: { type: String, default: '' },
  icon: { type: String, default: 'award' },
  createdAt: { type: Date, default: Date.now }
});

// 12. Success Stories Schema
const SuccessStorySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  targetAchieved: { type: String, required: true },
  backgroundInfo: { type: String, default: '' },
  strategyUsed: { type: String, default: '' },
  description: { type: String, required: true },
  citation: { type: String, default: '' },
  photoUrl: { type: String, default: '/assets/images/placeholder-student.webp' },
  createdAt: { type: Date, default: Date.now }
});

// 13. Career Guidance Schema
const CareerGuidanceSchema = new mongoose.Schema({
  domain: { type: String, required: true }, // e.g. Engineering, AI, Civil Services
  difficulty: { type: String, default: 'Medium' },
  averageSalary: { type: String, default: '' },
  description: { type: String, required: true },
  roadmapNodes: [{
    step: Number,
    title: String,
    details: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// 14. Resources Schema
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Code', 'Guide', 'PDF', 'Document'], default: 'PDF' },
  downloadUrl: { type: String, required: true },
  fileSize: { type: String, default: '1.2 MB' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 15. Study Materials Schema
const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  downloadUrl: { type: String, required: true },
  size: { type: String, default: '500 KB' },
  downloadsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// 16. Blog Posts Schema
const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'SDP Editorial' },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  readTime: { type: String, default: '5 min read' },
  imageUrl: { type: String, default: '/assets/images/placeholder-blog.webp' },
  slug: { type: String, unique: true },
  date: { type: Date, default: Date.now }
});

// 17. Settings Schema
const SettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String, default: '' }
});

// 18. Site Content Schema
const SiteContentSchema = new mongoose.Schema({
  pageName: { type: String, required: true, unique: true },
  sections: { type: mongoose.Schema.Types.Mixed, default: {} }
});

// 19. SEO Configurations Schema
const SEOConfigurationsSchema = new mongoose.Schema({
  pageRoute: { type: String, required: true, unique: true },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  ogTitle: { type: String, default: '' },
  ogDescription: { type: String, default: '' },
  ogImage: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' },
  keywords: { type: String, default: '' },
  schemas: { type: mongoose.Schema.Types.Mixed, default: {} }
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Inquiry: mongoose.model('Inquiry', InquirySchema),
  AILead: mongoose.model('AILead', AILeadSchema),
  AIQuestion: mongoose.model('AIQuestion', AIQuestionSchema),
  Result: mongoose.model('Result', ResultSchema),
  Program: mongoose.model('Program', ProgramSchema),
  Faculty: mongoose.model('Faculty', FacultySchema),
  Gallery: mongoose.model('Gallery', GallerySchema),
  Event: mongoose.model('Event', EventSchema),
  Testimonial: mongoose.model('Testimonial', TestimonialSchema),
  Achievement: mongoose.model('Achievement', AchievementSchema),
  SuccessStory: mongoose.model('SuccessStory', SuccessStorySchema),
  CareerGuidance: mongoose.model('CareerGuidance', CareerGuidanceSchema),
  Resource: mongoose.model('Resource', ResourceSchema),
  StudyMaterial: mongoose.model('StudyMaterial', StudyMaterialSchema),
  BlogPost: mongoose.model('BlogPost', BlogPostSchema),
  Settings: mongoose.model('Settings', SettingsSchema),
  SiteContent: mongoose.model('SiteContent', SiteContentSchema),
  SEOConfigurations: mongoose.model('SEOConfigurations', SEOConfigurationsSchema)
};
