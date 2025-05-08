"use client";

import { useState } from 'react';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: FormData) => void;
}

interface ProgramFeature {
  name: string;
  included: boolean;
}

interface ProgramFee {
  type: string;
  price: number;
  features: ProgramFeature[];
}

interface Mentor {
  name: string;
  image?: string;
  role: string;
  company: string;
  companyLogo?: string;
  description: string;
}

interface ImagePreviews {
  courseImage?: string;
  mentorImages: { [key: number]: string };
  mentorLogos: { [key: number]: string };
}

export default function CourseForm({ course, onSubmit }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(course?.features || []);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(course?.learningOutcomes || []);
  const [careerOpportunities, setCareerOpportunities] = useState<string[]>(course?.careerOpportunities || []);
  const [targetAudience, setTargetAudience] = useState<string[]>(course?.targetAudience || []);
  const [mentors, setMentors] = useState<Mentor[]>(course?.mentors || [{ name: '', role: '', company: '', description: '' }]);
  const [programFees, setProgramFees] = useState<ProgramFee[]>(course?.programFees || [{ type: '', price: 0, features: [{ name: '', included: true }] }]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews>({
    courseImage: course?.image,
    mentorImages: course?.mentors?.reduce((acc, mentor, index) => ({ ...acc, [index]: mentor.image }), {}) || {},
    mentorLogos: course?.mentors?.reduce((acc, mentor, index) => ({ ...acc, [index]: mentor.companyLogo }), {}) || {}
  });
  const { toast } = useToast();

  const handleImageChange = (file: File | null, type: 'courseImage' | 'mentorImage' | 'mentorLogo', index?: number) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'courseImage') {
        setImagePreviews(prev => ({ ...prev, courseImage: reader.result as string }));
      } else if (type === 'mentorImage' && index !== undefined) {
        setImagePreviews(prev => ({
          ...prev,
          mentorImages: { ...prev.mentorImages, [index]: reader.result as string }
        }));
      } else if (type === 'mentorLogo' && index !== undefined) {
        setImagePreviews(prev => ({
          ...prev,
          mentorLogos: { ...prev.mentorLogos, [index]: reader.result as string }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add course ID if updating
      if (course?._id) {
        formData.append('id', course._id.toString());
      }

      // Add all data to formData
      formData.append('features', JSON.stringify(features));
      formData.append('learningOutcomes', JSON.stringify(learningOutcomes));
      formData.append('careerOpportunities', JSON.stringify(careerOpportunities));
      formData.append('targetAudience', JSON.stringify(targetAudience));
      formData.append('mentors', JSON.stringify(mentors));
      formData.append('programFees', JSON.stringify(programFees));

      await onSubmit(formData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit course';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileInput = (label: string, type: 'courseImage' | 'mentorImage' | 'mentorLogo', index?: number) => {
    const previewImage = type === 'courseImage' 
      ? imagePreviews.courseImage 
      : type === 'mentorImage' && index !== undefined
        ? imagePreviews.mentorImages[index]
        : type === 'mentorLogo' && index !== undefined
          ? imagePreviews.mentorLogos[index]
          : undefined;

    const inputName = type === 'courseImage' 
      ? 'image' 
      : type === 'mentorImage'
        ? `mentor_image_${index}`
        : `mentor_logo_${index}`;

    return (
      <div className="space-y-2">
        {previewImage && (
          <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
            <Image
              src={previewImage}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
          <Input
            type="file"
            name={inputName}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null, type, index)}
          />
          <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
          <span className="mt-2 block text-sm font-medium">{label}</span>
        </div>
      </div>
    );
  };

  const handleArrayInput = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    array: string[],
    index: number,
    value: string
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, array: string[]) => {
    setter([...array, '']);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, array: string[], index: number) => {
    setter(array.filter((_, i) => i !== index));
  };

  const addMentor = () => {
    setMentors([...mentors, { name: '', role: '', company: '', description: '' }]);
  };

  const removeMentor = (index: number) => {
    setMentors(mentors.filter((_, i) => i !== index));
  };

  const updateMentor = (index: number, field: keyof Mentor, value: string) => {
    const newMentors = [...mentors];
    newMentors[index] = { ...newMentors[index], [field]: value };
    setMentors(newMentors);
  };

  const addProgramFee = () => {
    setProgramFees([...programFees, { type: '', price: 0, features: [{ name: '', included: true }] }]);
  };

  const removeProgramFee = (index: number) => {
    setProgramFees(programFees.filter((_, i) => i !== index));
  };

  const updateProgramFee = (index: number, field: keyof ProgramFee, value: string | number) => {
    const newProgramFees = [...programFees];
    newProgramFees[index] = { ...newProgramFees[index], [field]: value };
    setProgramFees(newProgramFees);
  };

  const addProgramFeature = (programIndex: number) => {
    const newProgramFees = [...programFees];
    newProgramFees[programIndex].features.push({ name: '', included: true });
    setProgramFees(newProgramFees);
  };

  const removeProgramFeature = (programIndex: number, featureIndex: number) => {
    const newProgramFees = [...programFees];
    newProgramFees[programIndex].features = newProgramFees[programIndex].features.filter((_, i) => i !== featureIndex);
    setProgramFees(newProgramFees);
  };

  const updateProgramFeature = (
    programIndex: number,
    featureIndex: number,
    field: keyof ProgramFeature,
    value: string | boolean
  ) => {
    const newProgramFees = [...programFees];
    const feature = newProgramFees[programIndex].features[featureIndex];
    
    if (field === 'name' && typeof value === 'string') {
      feature.name = value;
    } else if (field === 'included' && typeof value === 'boolean') {
      feature.included = value;
    }
    
    setProgramFees(newProgramFees);
  };

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label>Course Title *</Label>
              <Input
                name="title"
                defaultValue={course?.title}
                required
              />
            </div>

            <div>
              <Label>Course Image {!course && '*'}</Label>
              {renderFileInput('Upload Image', 'courseImage')}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rating (0-5) *</Label>
                <Input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={course?.rating}
                  required
                />
              </div>
              <div>
                <Label>Number of Reviews *</Label>
                <Input
                  name="reviews"
                  type="number"
                  min="0"
                  defaultValue={course?.reviews}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration *</Label>
                <Input
                  name="duration"
                  defaultValue={course?.duration}
                  required
                />
              </div>
              <div>
                <Label>Level *</Label>
                <Input
                  name="level"
                  defaultValue={course?.level}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price *</Label>
                <Input
                  name="price"
                  type="number"
                  min="0"
                  defaultValue={course?.price}
                  required
                />
              </div>
              <div>
                <Label>Discounted Price *</Label>
                <Input
                  name="discountedPrice"
                  type="number"
                  min="0"
                  defaultValue={course?.discountedPrice}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Next Batch *</Label>
                <Input
                  name="nextBatch"
                  type="date"
                  defaultValue={course?.nextBatch}
                  required
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Input
                  name="category"
                  defaultValue={course?.category}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                name="description"
                defaultValue={course?.description}
                required
              />
            </div>
          </div>

          {/* Features and Learning Outcomes */}
          <div className="space-y-6">
            {/* Features */}
            <div className="space-y-2">
              <Label>Features *</Label>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleArrayInput(setFeatures, features, index, e.target.value)}
                    placeholder="Enter feature"
                    required
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem(setFeatures, features, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(setFeatures, features)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

            {/* Learning Outcomes */}
            <div className="space-y-2">
              <Label>Learning Outcomes *</Label>
              {learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={outcome}
                    onChange={(e) => handleArrayInput(setLearningOutcomes, learningOutcomes, index, e.target.value)}
                    placeholder="Enter learning outcome"
                    required
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem(setLearningOutcomes, learningOutcomes, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(setLearningOutcomes, learningOutcomes)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Learning Outcome
              </Button>
            </div>

            {/* Career Opportunities */}
            <div className="space-y-2">
              <Label>Career Opportunities</Label>
              {careerOpportunities.map((opportunity, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={opportunity}
                    onChange={(e) => handleArrayInput(setCareerOpportunities, careerOpportunities, index, e.target.value)}
                    placeholder="Enter career opportunity"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem(setCareerOpportunities, careerOpportunities, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(setCareerOpportunities, careerOpportunities)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Career Opportunity
              </Button>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label>Target Audience</Label>
              {targetAudience.map((audience, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={audience}
                    onChange={(e) => handleArrayInput(setTargetAudience, targetAudience, index, e.target.value)}
                    placeholder="Enter target audience"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeArrayItem(setTargetAudience, targetAudience, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem(setTargetAudience, targetAudience)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Target Audience
              </Button>
            </div>
          </div>
        </div>

        {/* Mentors */}
        <div className="border-t border-b py-6">
          <h3 className="text-lg font-medium mb-4">Mentors *</h3>
          <div className="space-y-6">
            {mentors.map((mentor, index) => (
              <div key={index} className="p-4 border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Mentor {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMentor(index)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input
                      value={mentor.name}
                      onChange={(e) => updateMentor(index, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Role *</Label>
                    <Input
                      value={mentor.role}
                      onChange={(e) => updateMentor(index, 'role', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Company *</Label>
                    <Input
                      value={mentor.company}
                      onChange={(e) => updateMentor(index, 'company', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={mentor.description}
                      onChange={(e) => updateMentor(index, 'description', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Profile Image</Label>
                    {renderFileInput('Upload Image', 'mentorImage', index)}
                  </div>

                  <div>
                    <Label>Company Logo</Label>
                    {renderFileInput('Upload Logo', 'mentorLogo', index)}
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addMentor}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Mentor
            </Button>
          </div>
        </div>

        {/* Program Fees */}
        <div className="border-b py-6">
          <h3 className="text-lg font-medium mb-4">Program Fees *</h3>
          <div className="space-y-6">
            {programFees.map((program, programIndex) => (
              <div key={programIndex} className="p-4 border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Program Type {programIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProgramFee(programIndex)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Type *</Label>
                    <Input
                      value={program.type}
                      onChange={(e) => updateProgramFee(programIndex, 'type', e.target.value)}
                      placeholder="e.g., Basic, Premium"
                      required
                    />
                  </div>

                  <div>
                    <Label>Price *</Label>
                    <Input
                      type="number"
                      min="0"
                      value={program.price}
                      onChange={(e) => updateProgramFee(programIndex, 'price', Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Features *</Label>
                  {program.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 mt-2">
                      <Input
                        value={feature.name}
                        onChange={(e) => updateProgramFeature(programIndex, featureIndex, 'name', e.target.value)}
                        placeholder="Feature name"
                        required
                      />
                      
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-md bg-background">
                        <input
                          type="checkbox"
                          checked={feature.included}
                          onChange={(e) => updateProgramFeature(programIndex, featureIndex, 'included', e.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">Included</span>
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeProgramFeature(programIndex, featureIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addProgramFeature(programIndex)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addProgramFee}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Program Fee
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {course ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            course ? 'Update Course' : 'Create Course'
          )}
        </Button>
      </form>
    </ScrollArea>
  );
}
