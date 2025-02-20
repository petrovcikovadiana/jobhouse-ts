"use server";

import { uploadImage } from "@/lib/cloudinary";
import { storePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";

export async function createPost(formData) {
  // get actual user
  const { user } = await verifyAuth();

  if (!user) {
    throw new Error("You must be logged in to create a post.");
  }

  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");
  const location = formData.get("location");
  const salary = formData.get("salary");
  const jobContract = formData.get("jobContract");
  const company = formData.get("company");
  const field = formData.get("field");
  const seniority = formData.get("seniority");
  const languages = formData.get("languages");
  const technologies = formData.get("technologies");
  const requirements = formData.get("requirements");
  const skills = formData.get("skills");
  const benefits = formData.get("benefits");
  const errors = [];

  // validation
  if (!title || title.trim().length === 0) {
    errors.push("Title is required.");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required.");
  }

  if (!location || location.trim().length === 0) {
    errors.push("Location is required.");
  }
  if (!salary || salary.trim().length === 0) {
    errors.push("Salary is required.");
  }
  if (!jobContract || jobContract.trim().length === 0) {
    errors.push("JobContract is required.");
  }
  if (!company || company.trim().length === 0) {
    errors.push("Company is required.");
  }

  if (!field || field.trim().length === 0) {
    errors.push("Field is required.");
  }

  if (!seniority || seniority.trim().length === 0) {
    errors.push("Seniority is required.");
  }

  if (!languages || languages.trim().length === 0) {
    errors.push("languages is required.");
  }
  if (!technologies || technologies.trim().length === 0) {
    errors.push("technologies is required.");
  }
  if (!requirements || requirements.trim().length === 0) {
    errors.push("requirements is required.");
  }
  if (!skills || skills.trim().length === 0) {
    errors.push("skills is required.");
  }
  if (!benefits || benefits.trim().length === 0) {
    errors.push("benefits is required.");
  }

  if (!image || image.size === 0) {
    errors.push("Image is required.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "Image upload failed,post was not created. Please try again later"
    );
  }

  await storePost({
    imageUrl: imageUrl,
    title,
    content,
    userId: user.id,
    location,
    salary,
    jobContract,
    company,
    field,
    seniority,
    languages,
    technologies,
    requirements,
    skills,
    benefits,
  });
  revalidatePath("/", "layout");
  redirect("/feed");
}
