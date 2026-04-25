import requests

# testing create new comment
# url = "http://127.0.0.1:5000/comments"

# # Define the data to be sent in the POST request
data = {
    "ResortID": 8,
    "UserID": 0,
    "CommentText": "Much better than expect!",
    "Rating": 5
}

# # Send the POST request
# response = requests.post(url, json=data)

# # Print the response from the server
# print(f"Status Code: {response.status_code}")
# print(f"Response Data: {response.json()}")

# testing update comment
# url = "http://127.0.0.1:5000/comments/17/update"

# # Define the data to be sent in the PUT request
data = {
    "UserID": 578,
    "CommentText": "Updated comment: It turned out to be a bad experience.",
    "Rating": 2
}

# # Send the PUT request
# response = requests.put(url, json=data)

# # Print the response from the server
# print(f"Status Code: {response.status_code}")
# print(f"Response Data: {response.json()}")


# testing delete current comment
url = "http://127.0.0.1:5000/comments/16/delete"  # Assuming you want to delete the comment with ID 10

# Define the data to be sent for the DELETE request
data = {
    "UserID": 578  # Assuming UserID 10 wants to delete their comment
}

# Send the DELETE request
response = requests.delete(url, json=data)

# Print the response from the server
print(f"Status Code: {response.status_code}")
print(f"Response Data: {response.json()}")
