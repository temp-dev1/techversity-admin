import mongoose from 'mongoose';

const CertPartnerSchema = new mongoose.Schema({

  name: String,
  logo: String,
});

export interface CertPartner {
  _id: String;
  name: string;
  logo: string;
}

export default mongoose.models.CertPartner || mongoose.model('CertPartner', CertPartnerSchema);
