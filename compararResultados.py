import numpy as np;

#Vetor com vetor
vec1 = np.array([5,10,5,6])
vec2 = np.array([2,8,-5,-10])

result = vec1.dot( vec2 );

print("\nVetor com vetor", result);




#Matrix com vetor
matrix1 = np.array([
    [3,8,6,50],
    [1,2,2,100],
    [4,5,5,5],
    [1,2,2,2]
]);

vec3 = np.array([12, 5, 11, 8.5]);

result = matrix1.dot(vec3);

print("\nMatrix com vetor", result)




#Matrix com matrix
matrix1 = np.array([
    [3,8,6,50],
    [1,2,2,100],
    [4,5,5,5],
    [1,2,2,2]
]);

matrix2 = np.array([
    [-5,2,3,2],
    [1,25,1,50],
    [2,5,3,5],
    [1,4,4,2]
]);

result = matrix1.dot(matrix2);

print("\nMatrix com matrix", result)