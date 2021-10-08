import sys
import subprocess
import time

num_clients = int(sys.argv[1])
run_for_x_seconds = int(sys.argv[2])
processes = []

for i in range(num_clients):
    process = [
        'node',
        '-r',
        'esm',
        './src/test-client/TestClient.js',
        str(1200000 + i)
    ]
    print(' '.join(process))
    processes.append(subprocess.Popen(process))

print(f'Running. Will exit in {run_for_x_seconds}s')
time.sleep(run_for_x_seconds)
for p in processes:
    p.terminate()
print('Stopped all jobs.')