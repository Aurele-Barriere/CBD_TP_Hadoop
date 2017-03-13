// This function is called to retrieve the mesh
visit_handle get_mesh_data(int domain, 
    const char *name, void *cbdata) {
  visit_handle h = VISIT_INVALID_HANDLE;
  if(strcmp(name, "my_mesh") == 0) {
    if(VisIt_RectilinearMesh_alloc(&h) == VISIT_OKAY) {
      visit_handle hxc, hyc, hzc;
      VisIt_VariableData_alloc(&hxc);
      // ... idem for hyc and hzc
      VisIt_VariableData_setDataF(hxc, 
	  	VISIT_OWNER_SIM, 1, NX, mesh_x);
      // ... idem for hyc and hzc
      VisIt_RectilinearMesh_setCoordsXYZ(h,hxc,hyc,hzc);
      }
    }
    return h;
  }
}

// This function is called to retrieve the data
visit_handle get_variable_data(int domain, const char *name, void *cbdata) {
  visit_handle h = VISIT_INVALID_HANDLE;
  if(strcmp(name, "temperature") == 0) {
    if(VisIt_VariableData_alloc(&h) == VISIT_OKAY) {
      int size = NX*NY*NZ;
      VisIt_VariableData_setDataD(h, 
	  	VISIT_OWNER_SIM, 1, size, temp);
    }
  }
  return h;
}

// When a VisIt client connects, the callback 
// functions has to be provided using
VisItSetGetMesh(get_mesh_data,NULL);
VisItSetGetVariable(get_variable_data,NULL);
