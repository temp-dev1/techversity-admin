export interface Query {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college?: string;
  courseTitle: string;
  acceptTerms: boolean;
  createdAt: Date;
}

export interface SessionData {
  isAuthenticated: boolean;
  lastActivity: number;
}

export interface Partner {
  _id: string;
  id: number;
  name: string;
  logo: string;
}

export interface CertPartner {
  _id: string;
  name: string;
  logo: string;
}

export interface Expert {
  _id: string;
  id: number;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  image: string;
  experience: string;
  linkedin: string;
}

export interface Testimonial {
  _id: string;
  id: number;
  name: string;
  image: string;
  role: string;
  company: string;
  testimonial: string;
  course: string;
}

export interface Course {
  _id: string;
  id: number;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  duration: string;
  level: string;
  price: number;
  discountedPrice: number;
  nextBatch: string;
  category: string;
  features: string[];
  description: string;
  learningOutcomes: string[];
  careerOpportunities: string[];
  targetAudience: string[];
  mentors: {
    name: string;
    image: string;
    role: string;
    company: string;
    companyLogo: string;
    description: string;
  }[];
  programFees: {
    type: string;
    price: number;
    features: {
      name: string;
      included: boolean;
    }[];
  }[];
}
