// Create the variable data
vtkDataArray* wrapMyData(...)
{
  vtkDoubleArray* myArray = vtkDoubleArray::New();
  myArray->SetName("temperature");
  vtkIdType size = NX*NY*NZ;
  myArray->SetArray(temp, size, 1);
  return myArray;
}

// This function is called to retrieve the mesh
vtkObject* wrapMeshData(...)
{
  // creates the necessary coordinate arrays
  vtkFloatArray* xCoords, yCoords, zCoords;
  xCoords = vtkFloatArray::New();
  xCoords->setArray(mesh_x,PTX,1);
  // ... idem for yCoords and zCoords
  vtkRectilinearGrid *grid = vtkRectilinearGrid::New();
  grid->setDimensions(NX,NY,NZ);
  grid->setXCoordinates(xCoords);
  // ... idem for Y and Z coordinates
  vtkDataArray* array = wrapMyData(); // see above
  grid->GetPointData()->AddArray(array);
  array->Delete();
  return (vtkObject*)grid;
}
