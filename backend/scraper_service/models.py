from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class URL(BaseModel):
    url: str

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class RecipeModel(BaseModel):
    id: str = Field(default_factory=PyObjectId, alias='_id')
    host: str = Field(...)
    canonical_url: Optional[str]
    title: str = Field(...)
    category: Optional[str]
    totalTime: Optional[str]
    cookTime: Optional[str]
    prepTime: Optional[str]
    yields: Optional[str]
    image: Optional[str]
    nutrients: Optional[str]
    language: Optional[str]
    ingredients: list[str] = Field(...)
    instructions: list[str] = Field(...)
    ratings: Optional[str]
    author: Optional[str]
    cuisine: Optional[str]
    description: Optional[str]
    reviews: Optional[str]
    siteName: str = Field(...)

    class Config:
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "host": "deliciousfood.com",
                "canonical_url": "https://deliciousfood.com/hamburger",
                "title": "Hamburger",
                "category": "Street food",
                "totalTime": '30',
                "cookTime": "10",
                "prepTime": "20",
                "yields": "4",
                "image": "https://deliciousfood.com/hamburger.jpeg",
                "nutrients": "",
                "language": "en",
                "ingredients": "[meat, bread, lettuce]",
                "instructions": "[buy meat, cook it, put it in buns]",
                "ratings": "",
                "author": "John Doe",
                "cuisine": "tasty",
                "description": "Best hamburger in the world",
                "reviews": "",
                "siteName": "deliciousfood",
            }
        }

