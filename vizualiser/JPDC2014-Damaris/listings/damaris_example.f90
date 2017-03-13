program example
  integer ierr, is_client
  real, dimension(64,16,2) :: temperature
  real, dimension(4) :: x3d, y3d, z3d
 
  ! initialization
  call damaris_initialize_f("config.xml", MPI_COMM_WORLD, ierr) 
  call damaris_start_f(is_client, ierr)

  if(is_client.eq.1) then
	  
	! writing non-time-varying data
    call damaris_write_f("coordinates/x3d", x3d, ierr)
    call damaris_write_f("coordinates/y3d", y3d, ierr)
    call damaris_write_f("coordinates/z3d", z3d, ierr)
	  
    do while(...) ! simulation main loop
      ...
	  ! writing temperature data
      call damaris_write_f("temperature", temperature, ierr)
	  ! sending signal
      call damaris_signal_f("my_event", ierr)
	  ! end of iteration
      call damaris_end_iteration_f(ierr)
      ...
    enddo
    ! stopping the servers
    call damaris_stop_f(ierr)
  endif

  ! finalization
  call damaris_finalize_f(ierr)
end program example
