# TODO - setup ansible

```bash
function friend {
  FRIENDS=(blaze kolvicy godberry poseidon hades)
  for friend in ${FRIENDS[@]}; do
    echo "Chatting with: $friend, about $1"
    ssh -tq $friend "$1"
  done
  echo "Chatting with: $(hostname), about $1"
  $1
}
```