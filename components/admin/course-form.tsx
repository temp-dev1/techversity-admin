"use client";

import { useState } from 'react';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: FormData) => void;
}

export default function CourseForm({ course, onSubmit }: CourseFormProps) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(course?.features || []);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(course?.learningOutcomes || []);
  const [careerOpportunities, setCareerOpportunities] = useState<string[]>(course?.careerOpportunities || []);
  const [targetAudience, setTargetAudience] = useState<string[]>(course?.targetAudience || []);
  const [mentors, setMentors] = useState(course?.mentors || [{ name: '', role: '', company: '', description: '' }]);
  const [programFees, setProgramFees] = useState(course?.programFees || [{ type: '', price: 0, features: [{ name: '', included: true }] }]);
  const { toast } = useToast();

  // Inside course-form.tsx, update the handleSubmit function

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const formData = new FormData(e.currentTarget);
    
    // Validate required fields
    const title = formData.get('title') as string;
    const image = formData.get('image') as File;
    const rating = formData.get('rating') as string;
    const reviews = formData.get('reviews') as string;
    const duration = formData.get('duration') as string;
    const level = formData.get('level') as string;
    const price = formData.get('price') as string;
    const discountedPrice = formData.get('discountedPrice') as string;
    const nextBatch = formData.get('nextBatch') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    // Basic validation
    if (!title || !duration || !level || !category || !description) {
      throw new Error('Please fill in all required fields');
    }

    if (!course && !image?.size) {
      throw new Error('Please select a course image');
    }

    if (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5) {
      throw new Error('Rating must be between 0 and 5');
    }

    if (isNaN(Number(reviews)) || Number(reviews) < 0) {
      throw new Error('Number of reviews must be a positive number');
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      throw new Error('Price must be a positive number');
    }

    if (isNaN(Number(discountedPrice)) || Number(discountedPrice) < 0) {
      throw new Error('Discounted price must be a positive number');
    }

    if (Number(discountedPrice) > Number(price)) {
      throw new Error('Discounted price cannot be higher than regular price');
    }

    // Validate arrays
    if (features.length === 0) {
      throw new Error('Please add at least one feature');
    }

    if (learningOutcomes.length === 0) {
      throw new Error('Please add at least one learning outcome');
    }

    if (mentors.length === 0) {
      throw new Error('Please add at least one mentor');
    }

    // Validate mentors
    for (const mentor of mentors) {
      if (!mentor.name || !mentor.role || !mentor.company || !mentor.description) {
        throw new Error('Please fill in all mentor details');
      }
    }

    // Validate program fees
    for (const program of programFees) {
      if (!program.type || program.price <= 0) {
        throw new Error('Please fill in all program fee details');
      }
      if (program.features.length === 0) {
        throw new Error('Each program fee must have at least one feature');
      }
    }

    // Add array data to formData
    const courseData = {
      title,
      rating: Number(rating),
      reviews: Number(reviews),
      duration,
      level,
      price: Number(price),
      discountedPrice: Number(discountedPrice),
      nextBatch,
      category,
      description,
      features,
      learningOutcomes,
      careerOpportunities,
      targetAudience,
      mentors,
      programFees
    };

    // Append course ID if we're updating an existing course
    if (course?._id) {
      formData.append('id', course._id);
    }
     
    formData.append('data', JSON.stringify(courseData));
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
    setMentors([...mentors, { name: '', image: '', role: '', company: '', companyLogo: '', description: '' }]);
  };

  const removeMentor = (index: number) => {
    setMentors(mentors.filter((_, i) => i !== index));
  };

  const updateMentor = (index: number, field: string, value: string) => {
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

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={course?.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Course Image {!course && '*'}</Label>
            {course?.image && (
              <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                <Image
                  src={course.image}
                  alt="Current course image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required={!course}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating (0-5) *</Label>
              <Input
                id="rating"
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
              <Label htmlFor="reviews">Number of Reviews *</Label>
              <Input
                id="reviews"
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
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                name="duration"
                defaultValue={course?.duration}
                required
              />
            </div>

            <div>
              <Label htmlFor="level">Level *</Label>
              <Input
                id="level"
                name="level"
                defaultValue={course?.level}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                defaultValue={course?.price}
                required
              />
            </div>

            <div>
              <Label htmlFor="discountedPrice">Discounted Price *</Label>
              <Input
                id="discountedPrice"
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
              <Label htmlFor="nextBatch">Next Batch *</Label>
              <Input
                id="nextBatch"
                name="nextBatch"
                type="date"
                defaultValue={course?.nextBatch}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                defaultValue={course?.category}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={course?.description}
              required
            />
          </div>

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

          {/* Mentors */}
          <div className="space-y-4">
            <Label>Mentors *</Label>
            {mentors.map((mentor, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Mentor {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMentor(index)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Mentor
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    value={mentor.name}
                    onChange={(e) => updateMentor(index, 'name', e.target.value)}
                    placeholder="Name *"
                    required
                  />
                  
                  <div className="space-y-2">
                    {'image' in mentor && mentor.image && (
                      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={mentor.image}
                          alt={`${mentor.name}'s profile`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      name={`mentorImage_${index}`}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          updateMentor(index, 'image', URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </div>

                  <Input
                    value={mentor.role}
                    onChange={(e) => updateMentor(index, 'role', e.target.value)}
                    placeholder="Role *"
                    required
                  />
                  <Input
                    value={mentor.company}
                    onChange={(e) => updateMentor(index, 'company', e.target.value)}
                    placeholder="Company *"
                    required
                  />

                  <div className="space-y-2">
                    {'companyLogo' in mentor && mentor.companyLogo &&  (
                      <div className="relative w-full h-12 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={mentor.companyLogo}
                          alt={`${mentor.company} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      name={`companyLogo_${index}`}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          updateMentor(index, 'companyLogo', URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </div>

                  <Textarea
                    value={mentor.description}
                    onChange={(e) => updateMentor(index, 'description', e.target.value)}
                    placeholder="Description *"
                    required
                  />
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

          {/* Program Fees */}
          <div className="space-y-4">
            <Label>Program Fees *</Label>
            {programFees.map((program, programIndex) => (
              <div key={programIndex} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Program Type {programIndex + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProgramFee(programIndex)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Program
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    value={program.type}
                    onChange={(e) => {
                      const newProgramFees = [...programFees];
                      newProgramFees[programIndex].type = e.target.value;
                      setProgramFees(newProgramFees);
                    }}
                    placeholder="Program Type *"
                    required
                  />
                  <Input
                    type="number"
                    value={program.price}
                    onChange={(e) => {
                      const newProgramFees = [...programFees];
                      newProgramFees[programIndex].price = Number(e.target.value);
                      setProgramFees(newProgramFees);
                    }}
                    placeholder="Price *"
                    required
                    min="0"
                  />

                  <div className="space-y-2">
                    <Label>Features *</Label>
                    {program.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <Input
                          value={feature.name}
                          onChange={(e) => {
                            const newProgramFees = [...programFees];
                            newProgramFees[programIndex].features[featureIndex].name = e.target.value;
                            setProgramFees(newProgramFees);
                          }}
                          placeholder="Feature name *"
                          required
                        />
                        <Input
                          type="checkbox"
                          checked={feature.included}
                          onChange={(e) => {
                            const newProgramFees = [...programFees];
                            newProgramFees[programIndex].features[featureIndex].included = e.target.checked;
                            setProgramFees(newProgramFees);
                          }}
                          className="w-6"
                        />
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
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
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
