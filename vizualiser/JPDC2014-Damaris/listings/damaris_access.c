float* mesh_x = damaris_alloc("coordinates/x3d");
float* mesh_y = damaris_alloc("coordinates/y3d");
float* mesh_z = damaris_alloc("coordinates/z3d");
double* temp  = damaris_alloc("temperature");
...
damaris_commit("coordinates/x3d");
damaris_commit("coordinates/y3d");
damaris_commit("coordinates/z3d");
...
damaris_commit("temperature");
...
damaris_clear("temperature");
...
damaris_end_iteration();